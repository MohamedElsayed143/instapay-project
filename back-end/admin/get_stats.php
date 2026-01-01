<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once __DIR__ . "/../config/db.php";

try {
    // إجمالي عدد المستخدمين
    $usersCount = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    
    // إجمالي الأرصدة في المنصة
    $totalBalance = $pdo->query("SELECT SUM(balance) FROM users")->fetchColumn();
    
    // إجمالي عدد العمليات
    $transCount = $pdo->query("SELECT COUNT(*) FROM transactions")->fetchColumn();
    
    // إجمالي الفواتير المدفوعة
    $billsCount = $pdo->query("SELECT COUNT(*) FROM transactions WHERE type = 'bill'")->fetchColumn();

    echo json_encode([
        "status" => "success",
        "stats" => [
            "totalUsers" => (int)$usersCount,
            "totalBalance" => (float)$totalBalance,
            "totalTransactions" => (int)$transCount,
            "totalBills" => (int)$billsCount
        ]
    ]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>