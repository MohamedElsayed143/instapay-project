<?php
// 1. إعدادات الـ CORS
header("Access-Control-Allow-Origin: *"); // للتبسيط أثناء التطوير
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// تأكد من صحة المسار لملف db.php
require_once __DIR__ . "/../config/db.php"; 
require_once __DIR__ . "/../config/lang.php"; 

$data = json_decode(file_get_contents("php://input"), true);

$requester_id = $data['requester_id'] ?? null;
$payer_phone  = $data['payer_phone'] ?? null;
$amount       = $data['amount'] ?? null;

if (!$requester_id || !$payer_phone || !$amount) {
    echo json_encode(["status" => "error", "message" => __("missing_data")]);
    exit;
}

try {
    // التأكد من وجود الشخص المطلوب منه الدفع
    $stmt = $pdo->prepare("SELECT id FROM users WHERE phone = ?");
    $stmt->execute([$payer_phone]);
    $payer = $stmt->fetch();

    if (!$payer) {
        echo json_encode(["status" => "error", "message" => __("payer_not_found")]);
        exit;
    }

    $payer_id = $payer['id'];

    // تسجيل الطلب في جدول payment_requests
    // ملاحظة: تأكد من أسماء الأعمدة في قاعدة بياناتك ( requester_id )
    $stmt = $pdo->prepare("INSERT INTO payment_requests (requester_id, payer_phone, amount, status) VALUES (?, ?, ?, 'pending')");
    $stmt->execute([$requester_id, $payer_phone, $amount]);
    $request_id = $pdo->lastInsertId();

    // إدخال الإشعار
    $stmt = $pdo->prepare("INSERT INTO notifications (user_id, title, description, amount, type, request_id, is_read) VALUES (?, ?, ?, ?, 'payment_request', ?, 0)");
    $stmt->execute([$payer_id, __("payment_request"), __("new_money_request"), $amount, $request_id]);

    echo json_encode(["status" => "success", "message" => __("sent_successfully")]);

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>