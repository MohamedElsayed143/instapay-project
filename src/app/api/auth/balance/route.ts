import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/auth/balance?user_id=X
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { status: "error", message: "User ID required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: { balance: true },
    });

    if (!user) {
      return NextResponse.json({ status: "error", message: "User not found" });
    }

    return NextResponse.json({
      status: "success",
      balance: Number(user.balance),
    });
  } catch (error) {
    console.error("Get balance error:", error);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
