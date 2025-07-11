import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "hru_default_secret";

export async function POST(req: NextRequest) {
  const { name, contactEmail } = await req.json();
  if (!name || !contactEmail) {
    return NextResponse.json({ error: "参数缺失" }, { status: 400 });
  }
  // 创建匿名用户
  const user = await prisma.user.create({
    data: {
      email: `anon_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}@anon.hru`,
      contacts: {
        create: [{ name, email: contactEmail }],
      },
    },
  });
  // 生成token
  const token = jwt.sign({ userId: String(user.id), anon: true }, JWT_SECRET, {
    expiresIn: "2y",
  });
  return NextResponse.json({ token });
}
