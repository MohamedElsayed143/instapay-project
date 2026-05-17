import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { fullName, phone, password } = await req.json();

    if (!fullName || !phone || !password) {
      return NextResponse.json(
        { status: "error", message: "All fields are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) {
      return NextResponse.json({
        status: "error",
        message: "This phone number is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        fullName,
        phone,
        password: hashedPassword,
        role: "user",
        balance: 5000,
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
