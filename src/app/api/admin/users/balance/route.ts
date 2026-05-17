import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/admin/users/balance
export async function POST(req: NextRequest) {
  try {
    const { user_id, new_balance } = await req.json();

    if (user_id === undefined || new_balance === undefined) {
      return NextResponse.json(
        { status: "error", message: "user_id and new_balance are required" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: parseInt(user_id) },
        data: { balance: parseFloat(new_balance) },
      });

      await tx.transaction.create({
        data: {
          userId: parseInt(user_id),
          senderId: parseInt(user_id),
          receiverPhone: "",
          type: "transfer",
          serviceName: "Admin Balance Update",
          amount: parseFloat(new_balance),
        },
      });
    });

    return NextResponse.json({
      status: "success",
      message: "Balance updated successfully",
    });
  } catch (error) {
    console.error("Update balance error:", error);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
