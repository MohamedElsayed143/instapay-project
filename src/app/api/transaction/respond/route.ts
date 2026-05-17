import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { notification_id, request_id, status, user_id } = await req.json();

    if (!notification_id || !request_id || !status || !user_id) {
      return NextResponse.json(
        { status: "error", message: "Incomplete request data" },
        { status: 400 }
      );
    }

    const payerId = parseInt(user_id);

    await prisma.$transaction(async (tx) => {
      // Fetch payment request with requester
      const paymentRequest = await tx.paymentRequest.findUnique({
        where: { id: parseInt(request_id) },
        include: { requester: true },
      });

      if (!paymentRequest) throw new Error("Request not found");
      if (paymentRequest.status !== "pending") throw new Error("Request already processed");

      if (status === "accepted") {
        const payer = await tx.user.findUnique({ where: { id: payerId } });
        if (!payer) throw new Error("User not found");

        if (Number(payer.balance) < Number(paymentRequest.amount)) {
          throw new Error("Insufficient balance");
        }

        // Transfer funds
        await tx.user.update({
          where: { id: payerId },
          data: { balance: { decrement: Number(paymentRequest.amount) } },
        });
        await tx.user.update({
          where: { id: paymentRequest.requesterId },
          data: { balance: { increment: Number(paymentRequest.amount) } },
        });

        // Record transaction
        await tx.transaction.create({
          data: {
            senderId: payerId,
            receiverId: paymentRequest.requesterId,
            receiverPhone: paymentRequest.requester.phone ?? "",
            userId: payerId,
            type: "transfer",
            amount: paymentRequest.amount,
          },
        });

        // Notify requester
        await tx.notification.create({
          data: {
            userId: paymentRequest.requesterId,
            title: "Payment Received",
            description: "You received a payment",
            amount: String(paymentRequest.amount),
            type: "received_funds",
            isRead: false,
          },
        });
      }

      // Update request status
      await tx.paymentRequest.update({
        where: { id: parseInt(request_id) },
        data: { status: status as "accepted" | "rejected" },
      });

      // Mark notification as read
      await tx.notification.update({
        where: { id: parseInt(notification_id) },
        data: { isRead: true },
      });
    });

    return NextResponse.json({
      status: "success",
      message: "Transaction completed",
    });
  } catch (error: any) {
    console.error("Respond to request error:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Server error" },
      { status: 200 }
    );
  }
}
