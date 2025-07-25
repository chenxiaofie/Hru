import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendMail } from "@/lib/email";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  // 解析 URL 查询参数
  const url = new URL(req.url);
  const key = url.searchParams.get("key");

  // 校验密钥
  if (key !== process.env.CRON_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 清理30天前的日志
  const expire = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await prisma.mailLog.deleteMany({ where: { sentAt: { lt: expire } } });

  const users = await prisma.user.findMany({ include: { contacts: true } });
  const now = new Date();
  let notified = 0;

  for (const user of users) {
    if (!user.contacts.length) continue;

    const contact = user.contacts[0];
    const lastVisit = await prisma.visitLog.findFirst({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });

    if (
      !lastVisit ||
      now.getTime() - lastVisit.date.getTime() > 3 * 24 * 60 * 60 * 1000
    ) {
      const subject = "hru 紧急提醒";
      const text = `您好，您的亲友 ${contact.name} 已连续3天未打卡，请及时关注其情况。\n（本邮件为系统自动发送，请勿回复）`;

      let status = "success";
      let error = null;

      try {
        await sendMail({ to: contact.email, subject, text });
        // console.log("发送失败吗");
        notified++;
      } catch (e: unknown) {
        status = "fail";
        // console.log("发送失败吗", e);
        error = e instanceof Error ? e.message : String(e);
      }

      await prisma.mailLog.create({
        data: {
          userId: user.id,
          contactId: contact.id,
          status,
          error,
          sentEmail: contact.email, // 新增字段，记录发送的邮箱
        },
      });
    }
  }

  await prisma.$disconnect();
  return NextResponse.json({ ok: true, notified });
}
