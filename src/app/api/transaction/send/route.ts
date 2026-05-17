import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { sender_id, receiver_phone, amount } = await req.json();

    if (!sender_id || !receiver_phone || !amount) {
      return NextResponse.json(
        { status: "error", message: "Missing required fields" },
        { status: 400 }
      );
    }

    const senderId = parseInt(sender_id);
    const amountNum = parseFloat(amount);

    const result = await prisma.$transaction(async (tx) => {
      // Fetch sender
      const sender = await tx.user.findUnique({ where: { id: senderId } });
      if (!sender) throw new Error("Sender not found");
      if (Number(sender.balance) < amountNum) throw new Error("Insufficient balance");

      // Fetch receiver
      const receiver = await tx.user.findUnique({ where: { phone: receiver_phone } });
      if (!receiver) throw new Error("Phone number is not registered");
      if (receiver.id === senderId) throw new Error("Cannot transfer to yourself");

      // Update balances
      await tx.user.update({
        where: { id: senderId },
        data: { balance: { decrement: amountNum } },
      });
      await tx.user.update({
        where: { id: receiver.id },
        data: { balance: { increment: amountNum } },
      });

      // Record transaction
      await tx.transaction.create({
        data: {
          senderId,
          receiverId: receiver.id,
          receiverPhone: receiver_phone,
          userId: senderId,
          type: "transfer",
          serviceName: `Transfer to ${receiver.fullName}`,
          accountReference: receiver_phone,
          amount: amountNum,
        },
      });

      // Notifications
      await tx.notification.create({
        data: {
          userId: senderId,
          title: "Money Sent",
          description: `Sent to ${receiver.fullName}`,
          amount: String(amountNum),
          type: "sent_funds",
          isRead: true,
        },
      });
      await tx.notification.create({
        data: {
          userId: receiver.id,
          title: "Money Received",
          description: `Received from ${sender.fullName}`,
          amount: String(amountNum),
          type: "received_funds",
          isRead: false,
        },
      });

      return Number(sender.balance) - amountNum;
    });

    return NextResponse.json({ status: "success", new_balance: result });
  } catch (error: any) {
    console.error("Send money error:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Server error" },
      { status: 200 }
    );
  }
}
