<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data["sender_id"]) || empty($data["receiver_phone"]) || empty($data["amount"])) {
    echo json_encode(["status" => "error", "message" => "Missing required data"]);
    exit;
}

$sender_id = intval($data["sender_id"]);
$receiver_phone = $data["receiver_phone"];
$amount = floatval($data["amount"]);

try {
    // 1. جلب بيانات المرسل
    $stmt = $pdo->prepare("SELECT full_name, balance FROM users WHERE id = ?");
    $stmt->execute([$sender_id]);
    $sender = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$sender || $sender["balance"] < $amount) {
        echo json_encode(["status" => "error", "message" => "Insufficient balance"]);
        exit;
    }

    // 2. جلب بيانات المستقبل
    $stmt = $pdo->prepare("SELECT id, full_name FROM users WHERE phone = ?");
    $stmt->execute([$receiver_phone]);
    $receiver = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$receiver) {
        echo json_encode(["status" => "error", "message" => "This phone number is not registered"]);
        exit;
    }

    if ($receiver['id'] == $sender_id) {
        echo json_encode(["status" => "error", "message" => "You cannot transfer to yourself"]);
        exit;
    }

    $receiver_id = $receiver["id"];
    $pdo->beginTransaction();

    // 3. تحديث الأرصدة
    $pdo->prepare("UPDATE users SET balance = balance - ? WHERE id = ?")->execute([$amount, $sender_id]);
    $pdo->prepare("UPDATE users SET balance = balance + ? WHERE id = ?")->execute([$amount, $receiver_id]);

    // 4. التصحيح: التسجيل في جدول transactions بالبيانات كاملة
    // هذا سيحل مشكلة الـ NULL ويجعل الاسم يظهر في الداشبورد
    $stmt = $pdo->prepare("INSERT INTO transactions 
        (sender_id, receiver_id, receiver_phone, type, amount, service_name, account_reference, created_at) 
        VALUES (?, ?, ?, 'transfer', ?, ?, ?, NOW())");
    
    $service_name = "Transfer to " . $receiver['full_name'];
    $stmt->execute([
        $sender_id, 
        $receiver_id, 
        $receiver_phone, 
        $amount, 
        $service_name, 
        $receiver_phone
    ]);

    // 5. تسجيل إشعارات الطرفين
    $pdo->prepare("INSERT INTO notifications (user_id, title, description, amount, type, is_read, created_at) VALUES (?, 'Money Sent', ?, ?, 'sent_funds', 1, NOW())")
        ->execute([$sender_id, "Sent to " . $receiver['full_name'], $amount]);

    $pdo->prepare("INSERT INTO notifications (user_id, title, description, amount, type, is_read, created_at) VALUES (?, 'Money Received', ?, ?, 'received_funds', 0, NOW())")
        ->execute([$receiver_id, "Received from " . $sender['full_name'], $amount]);

    $pdo->commit();

    echo json_encode(["status" => "success", "new_balance" => ($sender["balance"] - $amount)]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollback();
    echo json_encode(["status" => "error", "message" => "Server Error: " . $e->getMessage()]);
}
?>