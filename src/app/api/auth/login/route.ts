import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { phone, password } = await req.json();

    if (!phone || !password) {
      return NextResponse.json(
        { status: "error", message: "Phone and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { phone } });

    if (!user || !user.password) {
      return NextResponse.json(
        { status: "error", message: "Incorrect phone or password" },
        { status: 200 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { status: "error", message: "Incorrect phone or password" },
        { status: 200 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Login successful",
      user: {
        id: user.id,
        name: user.fullName,
        balance: Number(user.balance),
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
