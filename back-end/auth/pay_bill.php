<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit;

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

// التحقق من البيانات المرسلة من الفرونت إند
if (!isset($data['user_id'], $data['amount'], $data['service'], $data['meter'])) {
    echo json_encode(["status" => "error", "message" => "Missing data"]);
    exit;
}

$userId = $data['user_id'];
$amount = floatval($data['amount']);
$service = $data['service'];
$meter = $data['meter'];

try {
    $pdo->beginTransaction();

    // 1. فحص الرصيد
    $stmt = $pdo->prepare("SELECT balance FROM users WHERE id = ? FOR UPDATE");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) throw new Exception("User not found");
    
    if ($user['balance'] < $amount) {
        throw new Exception("Insufficient balance. Your balance is " . $user['balance'] . " EGP");
    }

    // 2. خصم المبلغ من رصيد المستخدم
    $updateBalance = $pdo->prepare("UPDATE users SET balance = balance - ? WHERE id = ?");
    $updateBalance->execute([$amount, $userId]);

    /**
     * 3. التعديل الجوهري: التسجيل في جدول transactions
     * نستخدم الأعمدة: user_id, type, service_name, account_reference, amount
     */
    $insertTransaction = $pdo->prepare("
        INSERT INTO transactions 
        (user_id, sender_id, type, service_name, account_reference, amount, created_at) 
        VALUES (?, ?, 'bill', ?, ?, ?, NOW())
    ");
    // نضع الـ userId في sender_id أيضاً لضمان ظهورها في استعلامات الإرسال
    $insertTransaction->execute([$userId, $userId, $service, $meter, $amount]);

    // 4. اختياري: التسجيل في جدول bill_payments القديم إذا كنت لا تزال تحتاجه
    $insertBill = $pdo->prepare("
        INSERT INTO bill_payments (user_id, service_type, account_number, amount, payment_date) 
        VALUES (?, ?, ?, ?, NOW())
    ");
    $insertBill->execute([$userId, $service, $meter, $amount]);

    $pdo->commit();

    echo json_encode([
        "status" => "success", 
        "message" => "Payment successful!",
        "new_balance" => $user['balance'] - $amount
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>