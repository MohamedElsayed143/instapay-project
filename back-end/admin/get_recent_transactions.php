<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . "/../config/db.php";

try {
    // جلب العمليات مع ربطها بجدول المستخدمين لجلب الأسماء
    $query = "SELECT t.*, 
              u1.full_name as sender_name, 
              u2.full_name as receiver_name 
              FROM transactions t
              LEFT JOIN users u1 ON t.sender_id = u1.id
              LEFT JOIN users u2 ON t.receiver_id = u2.id
              ORDER BY t.created_at DESC LIMIT 5";
    
    $stmt = $pdo->query($query);
    $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "transactions" => $transactions]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>