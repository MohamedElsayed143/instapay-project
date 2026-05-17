import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { user_id, amount, service, meter } = await req.json();

    if (!user_id || !amount || !service || !meter) {
      return NextResponse.json(
        { status: "error", message: "Missing required fields" },
        { status: 400 }
      );
    }

    const userId = parseInt(user_id);
    const amountNum = parseFloat(amount);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error("User not found");

      if (Number(user.balance) < amountNum) {
        throw new Error(
          `Insufficient balance. Your balance is ${user.balance} EGP`
        );
      }

      // Deduct balance
      const updated = await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: amountNum } },
      });

      // Record transaction
      await tx.transaction.create({
        data: {
          userId,
          senderId: userId,
          receiverPhone: "",
          type: "bill",
          serviceName: service,
          accountReference: meter,
          amount: amountNum,
        },
      });

      // Record in bill_payments
      await tx.billPayment.create({
        data: {
          userId,
          serviceType: service,
          accountNumber: meter,
          amount: amountNum,
        },
      });

      return Number(updated.balance);
    });

    return NextResponse.json({
      status: "success",
      message: "Payment successful",
      new_balance: result,
    });
  } catch (error: any) {
    console.error("Pay bill error:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Server error" },
      { status: 200 }
    );
  }
}
