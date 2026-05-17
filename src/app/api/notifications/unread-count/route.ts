import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { status: "error", message: "user_id is required" },
        { status: 400 }
      );
    }

    const count = await prisma.notification.count({
      where: {
        userId: parseInt(userId),
        isRead: false,
      },
    });

    return NextResponse.json({ status: "success", unread_count: count });
  } catch (error) {
    console.error("Unread count error:", error);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
