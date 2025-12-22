<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit;

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$userId = $data['user_id'] ?? null;
$newBalance = $data['new_balance'] ?? null;

if ($userId === null || $newBalance === null) {
    echo json_encode(["status" => "error", "message" => "User ID and New Balance are required"]);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1. تحديث الرصيد في جدول users
    $stmt = $pdo->prepare("UPDATE users SET balance = ? WHERE id = ?");
    $stmt->execute([$newBalance, $userId]);

    // 2. تسجيل العملية كـ 'Admin Adjustment' في جدول transactions لضمان الشفافية
    $stmtTx = $pdo->prepare("
        INSERT INTO transactions 
        (user_id, sender_id, type, amount, service_name, created_at) 
        VALUES (?, ?, 'admin_credit', ?, 'Admin Balance Update', NOW())
    ");
    $stmtTx->execute([$userId, $userId, $newBalance]);

    $pdo->commit();
    echo json_encode(["status" => "success", "message" => "Balance updated successfully"]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>