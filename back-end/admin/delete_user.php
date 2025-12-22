<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['user_id'])) {
    echo json_encode(["status" => "error", "message" => "User ID is required"]);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$data['user_id']]);

    echo json_encode(["status" => "success", "message" => "User deleted successfully"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Could not delete user: " . $e->getMessage()]);
}
?>