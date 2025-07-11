import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "hru_default_secret";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  if (!userId)
    return NextResponse.json({ error: "缺少userId" }, { status: 400 });
  const token = jwt.sign({ userId: String(userId) }, JWT_SECRET, {
    expiresIn: "2y",
  });
  return NextResponse.json({ token });
}
