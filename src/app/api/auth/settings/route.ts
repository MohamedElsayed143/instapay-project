import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, user_id } = body;

    if (!action || !user_id) {
      return NextResponse.json(
        { status: "error", message: "Invalid request" },
        { status: 400 }
      );
    }

    const userId = parseInt(user_id);

    // ── Update Name ──────────────────────────────────────────────────────────
    if (action === "update_name") {
      const newName = body.name?.trim();
      if (!newName) {
        return NextResponse.json({
          status: "error",
          message: "Name is required",
        });
      }

      await prisma.user.update({
        where: { id: userId },
        data: { fullName: newName },
      });

      return NextResponse.json({ status: "success", message: "Name updated" });
    }

    // ── Change Password ───────────────────────────────────────────────────────
    if (action === "change_password") {
      const { oldPassword, newPassword } = body;

      if (!oldPassword || !newPassword) {
        return NextResponse.json({
          status: "error",
          message: "All fields are required",
        });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || !user.password) {
        return NextResponse.json({
          status: "error",
          message: "User not found",
        });
      }

      const isCorrect = await bcrypt.compare(oldPassword, user.password);
      if (!isCorrect) {
        return NextResponse.json({
          status: "error",
          message: "Current password is incorrect",
        });
      }

      if (oldPassword === newPassword) {
        return NextResponse.json({
          status: "error",
          message: "New password must be different from current password",
        });
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashed },
      });

      return NextResponse.json({
        status: "success",
        message: "Password changed successfully",
      });
    }

    return NextResponse.json(
      { status: "error", message: "Unknown action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Settings error:", error);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
