<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit;

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);
$notification_id = $data['notification_id'] ?? null;
$request_id      = $data['request_id'] ?? null;
$status          = $data['status'] ?? null; 
$user_id         = $data['user_id'] ?? null; 

try {
    if (!$notification_id || !$request_id || !$status || !$user_id) {
        throw new Exception("Incomplete request data");
    }

    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        SELECT pr.*, u.phone as requester_phone 
        FROM payment_requests pr 
        JOIN users u ON pr.requester_id = u.id 
        WHERE pr.id = ?
    ");
    $stmt->execute([$request_id]);
    $paymentRequest = $stmt->fetch();

    if (!$paymentRequest) throw new Exception("Request not found");
    if ($paymentRequest['status'] !== 'pending') throw new Exception("Already processed");

    if ($status === 'accepted') {
        $stmt = $pdo->prepare("SELECT balance FROM users WHERE id = ? FOR UPDATE");
        $stmt->execute([$user_id]);
        $payer = $stmt->fetch();

        if ($payer['balance'] < $paymentRequest['amount']) {
            throw new Exception("Insufficient balance");
        }

        // تحويل الرصيد
        $pdo->prepare("UPDATE users SET balance = balance - ? WHERE id = ?")
            ->execute([$paymentRequest['amount'], $user_id]);
        $pdo->prepare("UPDATE users SET balance = balance + ? WHERE id = ?")
            ->execute([$paymentRequest['amount'], $paymentRequest['requester_id']]);

        // تسجيل المعاملة
        $pdo->prepare("INSERT INTO transactions (sender_id, receiver_id, amount, type) VALUES (?, ?, ?, 'transfer')")
            ->execute([$user_id, $paymentRequest['requester_id'], $paymentRequest['amount']]);

        // إشعارات
        $pdo->prepare("INSERT INTO notifications (user_id, title, description, amount, type) VALUES (?, 'Payment Received', 'You received a payment', ?, 'received_funds')")
            ->execute([$paymentRequest['requester_id'], $paymentRequest['amount']]);
    }

    $pdo->prepare("UPDATE payment_requests SET status = ? WHERE id = ?")->execute([$status, $request_id]);
    $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE id = ?")->execute([$notification_id]);

    $pdo->commit();
    echo json_encode(["status" => "success", "message" => "Transaction completed"]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}