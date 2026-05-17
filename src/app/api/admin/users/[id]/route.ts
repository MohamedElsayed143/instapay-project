import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE /api/admin/users/[id] — soft delete a user
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.user.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users/[id] — update user info
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { full_name, phone, balance, role } = await req.json();

    await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        ...(full_name && { fullName: full_name }),
        ...(phone && { phone }),
        ...(balance !== undefined && { balance: parseFloat(balance) }),
        ...(role && { role }),
      },
    });

    return NextResponse.json({
      status: "success",
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
