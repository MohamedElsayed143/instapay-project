<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once "../config/db.php";

try {
    // استعلام متطور يربط جدول العمليات بجدول المستخدمين مرتين لضمان جلب بيانات الأدمن واليوزرز
    $query = "SELECT 
                t.*, 
                COALESCE(u.full_name, u2.full_name, 'System Admin') as sender_name, 
                COALESCE(u.phone, u2.phone, 'N/A') as sender_phone 
              FROM transactions t 
              LEFT JOIN users u ON t.user_id = u.id 
              LEFT JOIN users u2 ON t.sender_id = u2.id 
              ORDER BY t.created_at DESC";

    $stmt = $pdo->query($query);
    $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "transactions" => $transactions
    ]);
} catch (Exception $e) {
    echo json_encode([
        "status" => "error", 
        "message" => $e->getMessage()
    ]);
}
?>