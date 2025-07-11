import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { sendMail } from "@/lib/email";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "hru_default_secret";

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: "缺少token" }, { status: 401 });
  let userId;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      anon?: boolean;
    };
    userId = payload.userId;
  } catch {
    return NextResponse.json({ error: "token无效" }, { status: 401 });
  }
  // 查找用户和紧急联系人
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { contacts: true },
  });
  if (!user || user.contacts.length === 0) {
    return NextResponse.json({ error: "未找到紧急联系人" }, { status: 400 });
  }
  // 校验最近访问时间
  const lastVisit = await prisma.visitLog.findFirst({
    where: { userId },
    orderBy: { date: "desc" },
  });
  const now = new Date();
  // 3天 = 3 * 24 * 60 * 60 * 1000 毫秒
  if (
    lastVisit &&
    now.getTime() - lastVisit.date.getTime() <= 3 * 24 * 60 * 60 * 1000
  ) {
    return NextResponse.json({ error: "未超时，无需提醒" }, { status: 400 });
  }
  const contact = user.contacts[0];
  // 邮件模板
  const subject = "hru 紧急提醒";
  const text = `您好，您的亲友 ${contact.name} 已连续3天未打开 hru 应用，请及时关注其情况。\n（本邮件为系统自动发送，请勿回复）`;
  try {
    await sendMail({
      to: contact.email,
      subject,
      text,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "邮件发送失败" }, { status: 500 });
  }
}
