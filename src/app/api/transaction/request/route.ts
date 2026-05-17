import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { requester_id, payer_phone, amount } = await req.json();

    if (!requester_id || !payer_phone || !amount) {
      return NextResponse.json(
        { status: "error", message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the payer
    const payer = await prisma.user.findUnique({
      where: { phone: payer_phone },
    });

    if (!payer) {
      return NextResponse.json({
        status: "error",
        message: "Payer phone number not found",
      });
    }

    // Create payment request and notification in a transaction
    await prisma.$transaction(async (tx) => {
      const paymentRequest = await tx.paymentRequest.create({
        data: {
          requesterId: parseInt(requester_id),
          payerPhone: payer_phone,
          amount: parseFloat(amount),
          status: "pending",
        },
      });

      await tx.notification.create({
        data: {
          userId: payer.id,
          title: "Payment Request",
          description: "New money request received",
          amount: String(amount),
          type: "payment_request",
          requestId: paymentRequest.id,
          isRead: false,
        },
      });
    });

    return NextResponse.json({
      status: "success",
      message: "Request sent successfully",
    });
  } catch (error: any) {
    console.error("Send request error:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
