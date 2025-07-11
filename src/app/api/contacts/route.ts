import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "hru_default_secret";

function getUserIdFromRequest(req: NextRequest): number | null {
  const auth = req.headers.get("authorization");
  let token = null;
  if (auth && auth.startsWith("Bearer ")) {
    token = auth.slice(7);
  }
  // 兼容POST body传token
  if (!token && req.method === "POST") {
    // 这里不能同步获取body，只能在POST里单独处理
    return null;
  }
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      anon?: boolean;
    };
    return payload.userId;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "未认证" }, { status: 401 });
  const contacts = await prisma.contact.findMany({ where: { userId } });
  return NextResponse.json(contacts);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  let userId = null;
  // 支持token从body传递
  if (data.token) {
    try {
      const payload = jwt.verify(data.token, JWT_SECRET) as {
        userId: number;
        anon?: boolean;
      };
      userId = payload.userId;
    } catch {
      return NextResponse.json({ error: "token无效" }, { status: 401 });
    }
  }
  if (!userId) return NextResponse.json({ error: "未认证" }, { status: 401 });
  const contact = await prisma.contact.create({
    data: {
      name: data.name,
      email: data.email,
      userId,
    },
  });
  return NextResponse.json(contact);
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url!);
  const id = url.searchParams.get("id");
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!id || !token)
    return NextResponse.json({ error: "参数或认证缺失" }, { status: 400 });
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
  // 只允许删除自己的联系人
  const contact = await prisma.contact.findUnique({
    where: { id: Number(id) },
  });
  if (!contact || contact.userId !== userId) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }
  await prisma.contact.delete({ where: { id: Number(id) } });
  return NextResponse.json({ ok: true });
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  const { id, name, email, token } = data;
  if (!id || !name || !email || !token)
    return NextResponse.json({ error: "参数缺失" }, { status: 400 });
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
  // 只允许修改自己的联系人
  const contact = await prisma.contact.findUnique({
    where: { id: Number(id) },
  });
  if (!contact || contact.userId !== userId) {
    return NextResponse.json({ error: "无权限" }, { status: 403 });
  }
  const updated = await prisma.contact.update({
    where: { id: Number(id) },
    data: { name, email },
  });
  return NextResponse.json(updated);
}
