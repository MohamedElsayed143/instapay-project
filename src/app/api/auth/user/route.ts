import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { status: "error", message: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        fullName: true,
        phone: true,
        balance: true,
        avatar: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ status: "error", message: "User not found" });
    }

    return NextResponse.json({
      status: "success",
      user: {
        id: user.id,
        full_name: user.fullName,
        name: user.fullName,
        phone: user.phone,
        balance: Number(user.balance),
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
