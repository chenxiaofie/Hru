import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

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
  // 记录访问
  await prisma.visitLog.create({
    data: {
      userId,
      date: new Date(),
    },
  });
  return NextResponse.json({ ok: true });
}
