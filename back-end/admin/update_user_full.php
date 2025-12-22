<?php
// السماح بالوصول من الفرونت إند
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// التعامل مع طلبات الـ Preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

// التأكد من وصول البيانات المطلوبة
if (!isset($data['user_id'], $data['new_phone'], $data['new_balance'], $data['new_name'])) {
    echo json_encode(["status" => "error", "message" => "Incomplete data sent from frontend"]);
    exit;
}

try {
    // تحديث كل البيانات في خطوة واحدة
    $stmt = $pdo->prepare("UPDATE users SET full_name = ?, phone = ?, balance = ? WHERE id = ?");
    $result = $stmt->execute([
        $data['new_name'],
        $data['new_phone'],
        $data['new_balance'],
        $data['user_id']
    ]);

    echo json_encode(["status" => "success", "message" => "User updated successfully"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>