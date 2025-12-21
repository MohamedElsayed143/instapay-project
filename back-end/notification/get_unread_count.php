<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require_once "../config/db.php";

$user_id = $_GET['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(["count" => 0]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT COUNT(*) as unread_count FROM notifications WHERE user_id = ? AND is_read = 0");
    $stmt->execute([$user_id]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "unread_count" => (int)$result['unread_count']]);
} catch (PDOException $e) {
    echo json_encode(["unread_count" => 0]);
}
?>