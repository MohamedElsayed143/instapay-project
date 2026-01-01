<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

require_once __DIR__ . "/../config/db.php";

try {
    // جلب كل البيانات الأساسية بما فيها الرتبة والصورة الشخصية
    $stmt = $pdo->query("SELECT id, full_name, phone, balance, role, avatar FROM users ORDER BY id ASC");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "users" => $users
    ]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Server error: " . $e->getMessage()]);
}
?>