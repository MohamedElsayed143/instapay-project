import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/auth/bills?user_id=X
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

    const bills = await prisma.billPayment.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { paymentDate: "desc" },
      take: 20,
    });

    const formatted = bills.map((b) => ({
      id: b.id,
      service_name: b.serviceType,
      account_number: b.accountNumber,
      amount: Number(b.amount),
      payment_date: b.paymentDate.toISOString(),
    }));

    return NextResponse.json({ status: "success", bills: formatted });
  } catch (error) {
    console.error("Get bills error:", error);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
