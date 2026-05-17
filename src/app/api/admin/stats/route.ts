import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const [userCount, balanceAgg, txCount, billCount] = await Promise.all([
      prisma.user.count(),
      prisma.user.aggregate({ _sum: { balance: true } }),
      prisma.transaction.count(),
      prisma.transaction.count({ where: { type: "bill" } }),
    ]);

    return NextResponse.json({
      status: "success",
      stats: {
        totalUsers: userCount,
        totalBalance: Number(balanceAgg._sum.balance ?? 0),
        totalTransactions: txCount,
        totalBills: billCount,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { status: "error", message: "Server error" },
      { status: 500 }
    );
  }
}
