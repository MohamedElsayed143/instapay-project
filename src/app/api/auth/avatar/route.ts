import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;
    const userId = formData.get("user_id") as string | null;

    if (!file || !userId) {
      return NextResponse.json(
        { status: "error", message: "Avatar and user_id are required" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        status: "error",
        message: "Only JPEG, PNG, GIF or WebP files are allowed",
      });
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({
        status: "error",
        message: "File size must be under 5MB",
      });
    }

    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `avatar_${userId}_${Date.now()}.${ext}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "avatars");

    await mkdir(uploadsDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, filename), buffer);

    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { avatar: filename },
    });

    return NextResponse.json({
      status: "success",
      message: "Avatar updated successfully",
      filename,
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { status: "error", message: "Upload failed" },
      { status: 500 }
    );
  }
}
