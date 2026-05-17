import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/admin/activity — all transactions for the activity log
export async function GET(req: NextRequest) {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        sender: { select: { fullName: true } },
        receiver: { select: { fullName: true } },
      },
    });

    const formatted = transactions.map((tx) => ({
      id: tx.id,
      amount: Number(tx.amount),
      type: tx.type,
      service_name: tx.serviceName,
      sender_name: tx.sender?.fullName ?? null,
      receiver_name: tx.receiver?.fullName ?? null,
      receiver_phone: tx.receiverPhone,
      created_at: tx.createdAt.toISOString(),
    }));

    return NextResponse.json({ status: "success", transactions: formatted });
  } catch (error) {
    console.error("Admin activity error:", error);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
