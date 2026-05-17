import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE /api/auth/delete
// Body: { id: number }
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.id ?? body.user_id;

    if (!userId) {
      return NextResponse.json(
        { status: "error", message: "User ID required" },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id: parseInt(userId) } });

    return NextResponse.json({
      status: "success",
      message: "Account deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
