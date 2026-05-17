import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE /api/auth/bills/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.billPayment.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({
      status: "success",
      message: "Bill record deleted",
    });
  } catch (error: any) {
    console.error("Delete bill error:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
