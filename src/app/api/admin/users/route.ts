import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        fullName: true,
        phone: true,
        balance: true,
        role: true,
        avatar: true,
      },
    });

    const formatted = users.map((u) => ({
      id: u.id,
      full_name: u.fullName,
      phone: u.phone,
      balance: Number(u.balance),
      role: u.role,
      avatar: u.avatar,
    }));

    return NextResponse.json({ status: "success", users: formatted });
  } catch (error) {
    console.error("Get all users error:", error);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
