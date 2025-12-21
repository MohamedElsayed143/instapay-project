<?php
// 1. إعدادات الـ CORS - يجب أن تكون في بداية الملف قبل أي مخرجات
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// التعامل مع طلب الـ Preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../config/db.php";

// 2. استقبال البيانات من الـ React
$data = json_decode(file_get_contents("php://input"), true);

$requester_id = $data['requester_id'] ?? null;
$payer_phone  = $data['payer_phone'] ?? null;
$amount       = $data['amount'] ?? null;

// التحقق من تعبئة الحقول
if (!$requester_id || !$payer_phone || !$amount) {
    echo json_encode(["status" => "error", "message" => "All fields are required"]);
    exit;
}

try {
    // 3. التأكد من وجود الشخص المطلوب منه الدفع (الـ Payer)
    $stmt = $pdo->prepare("SELECT id FROM users WHERE phone = ?");
    $stmt->execute([$payer_phone]);
    $payer = $stmt->fetch();

    if (!$payer) {
        echo json_encode(["status" => "error", "message" => "This phone number is not registered in InstaPay"]);
        exit;
    }

    $payer_id = $payer['id'];

    // منع المستخدم من إرسال طلب دفع لنفسه
    $stmt = $pdo->prepare("SELECT phone FROM users WHERE id = ?");
    $stmt->execute([$requester_id]);
    $requester_phone = $stmt->fetchColumn();

    if ($requester_phone === $payer_phone) {
        echo json_encode(["status" => "error", "message" => "You cannot request money from yourself"]);
        exit;
    }

    // 4. تسجيل الطلب في جدول payment_requests
    $stmt = $pdo->prepare("INSERT INTO payment_requests (requester_id, payer_phone, amount, status) VALUES (?, ?, ?, 'pending')");
    $stmt->execute([$requester_id, $payer_phone, $amount]);
    $request_id = $pdo->lastInsertId();

    // 5. إعداد الإشعار (تم استبدال name بـ phone لتجنب الخطأ)
    $title = "Payment Request";
    $description = "User ($requester_phone) is requesting $amount EGP from you.";

    // 6. إدخال الإشعار في جدول notifications وربطه بـ request_id
    $stmt = $pdo->prepare("INSERT INTO notifications (user_id, title, description, amount, type, request_id, is_read) VALUES (?, ?, ?, ?, 'payment_request', ?, 0)");
    $stmt->execute([$payer_id, $title, $description, $amount, $request_id]);

    echo json_encode(["status" => "success", "message" => "Request sent successfully to $payer_phone"]);

} catch (PDOException $e) {
    // في حالة حدوث خطأ في قاعدة البيانات
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>