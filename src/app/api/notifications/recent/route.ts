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

    // Get the last 10 transactions for this user (as sender or receiver)
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [{ senderId: uid }, { receiverId: uid }],
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        sender: { select: { fullName: true } },
        receiver: { select: { fullName: true } },
      },
    });

    const formatted = transactions.map((tx) => {
      const isSender = tx.senderId === uid;
      const isBill = tx.type === "bill";

      let direction: "sent" | "received" | "bill" = "received";
      if (isBill) direction = "bill";
      else if (isSender) direction = "sent";

      let displayName = "";
      if (isBill) {
        displayName = tx.serviceName ?? "Utility Bill";
      } else if (isSender) {
        displayName = tx.receiver?.fullName ?? tx.serviceName ?? "Unknown";
      } else {
        displayName = tx.sender?.fullName ?? tx.serviceName ?? "Unknown";
      }

      return {
        id: tx.id,
        amount: Number(tx.amount),
        type: tx.type,
        display_name: displayName,
        account_reference: tx.accountReference ?? "",
        created_at: tx.createdAt.toISOString(),
        direction,
      };
    });

    return NextResponse.json({ status: "success", transactions: formatted });
  } catch (error) {
    console.error("Get recent transactions error:", error);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
