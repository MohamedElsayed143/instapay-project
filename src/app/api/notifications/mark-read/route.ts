import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/notifications/mark-read?user_id=X  (GET also supported per PHP original)
// Marks all unread notifications for a user as read
export async function GET(req: NextRequest) {
  return markAllRead(req);
}

export async function POST(req: NextRequest) {
  return markAllRead(req);
}

async function markAllRead(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { status: "error", message: "User ID required" },
        { status: 400 }
      );
    }

    const result = await prisma.notification.updateMany({
      where: {
        userId: parseInt(userId),
        isRead: false,
      },
      data: { isRead: true },
    });

    return NextResponse.json({
      status: "success",
      message: "Notifications marked as read",
      updated_count: result.count,
    });
  } catch (error) {
    console.error("Mark read error:", error);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
