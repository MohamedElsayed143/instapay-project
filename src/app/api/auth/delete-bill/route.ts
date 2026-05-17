import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { bill_id } = await req.json();

    if (!bill_id) {
      return NextResponse.json(
        { status: "error", message: "bill_id is required" },
        { status: 400 }
      );
    }

    await prisma.billPayment.delete({ where: { id: parseInt(bill_id) } });

    return NextResponse.json({
      status: "success",
      message: "Bill record deleted",
    });
  } catch (error) {
    console.error("Delete bill error:", error);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
