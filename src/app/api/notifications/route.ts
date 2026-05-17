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

    const uid = parseInt(userId);

    const notifications = await prisma.notification.findMany({
      where: { userId: uid },
      orderBy: { createdAt: "desc" },
    });

    const formatted = notifications.map((n) => ({
      id: n.id,
      request_id: n.requestId,
      title: n.title,
      description: n.description,
      amount: n.amount,
      type: n.type,
      created_at: n.createdAt.toISOString(),
      is_read: n.isRead ? 1 : 0,
    }));

    // Auto-mark non-payment-request notifications as read
    await prisma.notification.updateMany({
      where: {
        userId: uid,
        isRead: false,
        NOT: { type: "payment_request" },
      },
      data: { isRead: true },
    });

    return NextResponse.json({ status: "success", notifications: formatted });
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
