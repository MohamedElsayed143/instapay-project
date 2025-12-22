<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

require_once "../config/db.php";

$id = $_GET["id"] ?? "";

if (!$id) {
    echo json_encode(["status" => "error", "message" => "User ID required"]);
    exit;
}

try {
    // إضافة avatar للاستعلام
    $stmt = $pdo->prepare("SELECT id, full_name, phone, balance, avatar, role FROM users WHERE id = ?");
    $stmt->execute([$id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode(["status" => "success", "user" => $user]);
    } else {
        echo json_encode(["status" => "error", "message" => "User not found"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Server error"]);
}