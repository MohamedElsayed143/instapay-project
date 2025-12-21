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
        throw new Exception("Missing required fields");
    }

    $pdo->beginTransaction();

    // 1. جلب بيانات طلب الدفع ومعلومات المستلم
    $stmt = $pdo->prepare("
        SELECT pr.*, u.phone as requester_phone 
        FROM payment_requests pr 
        JOIN users u ON pr.requester_id = u.id 
        WHERE pr.id = ?
    ");
    $stmt->execute([$request_id]);
    $paymentRequest = $stmt->fetch();

    if (!$paymentRequest) throw new Exception("Payment request not found");
    if ($paymentRequest['status'] !== 'pending') throw new Exception("Request already processed");

    if ($status === 'accepted') {
        // 2. جلب رصيد الدافع (المستخدم الحالي)
        $stmt = $pdo->prepare("SELECT balance FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $payer = $stmt->fetch();

        if (!$payer) throw new Exception("User account not found");

        if ($payer['balance'] < $paymentRequest['amount']) {
            throw new Exception("Insufficient balance. You need " . $paymentRequest['amount'] . " EGP");
        }

        // 3. تحديث الأرصدة (التحويل المالي)
        $pdo->prepare("UPDATE users SET balance = balance - ? WHERE id = ?")
            ->execute([$paymentRequest['amount'], $user_id]);
        
        $pdo->prepare("UPDATE users SET balance = balance + ? WHERE id = ?")
            ->execute([$paymentRequest['amount'], $paymentRequest['requester_id']]);

        // 4. تسجيل المعاملة (استخدام الأسماء الجديدة للأعمدة)
        $pdo->prepare("INSERT INTO transactions (sender_id, receiver_id, receiver_phone, amount, type) VALUES (?, ?, ?, ?, 'transfer')")
            ->execute([
                $user_id, 
                $paymentRequest['requester_id'], 
                $paymentRequest['requester_phone'], 
                $paymentRequest['amount']
            ]);

        // 5. إشعارات النجاح للطرفين
        $pdo->prepare("INSERT INTO notifications (user_id, title, description, amount, type, is_read, request_id) VALUES (?, 'Payment Received', ?, ?, 'received_funds', 0, ?)")
            ->execute([$paymentRequest['requester_id'], "Received " . $paymentRequest['amount'] . " EGP from your request", $paymentRequest['amount'], $request_id]);

        $pdo->prepare("INSERT INTO notifications (user_id, title, description, amount, type, is_read, request_id) VALUES (?, 'Payment Sent', ?, ?, 'sent_funds', 1, ?)")
            ->execute([$user_id, "Paid request of " . $paymentRequest['amount'] . " EGP successfully", $paymentRequest['amount'], $request_id]);

    } else {
        // حالة الرفض (Rejected)
        $pdo->prepare("INSERT INTO notifications (user_id, title, description, amount, type, is_read, request_id) VALUES (?, 'Request Rejected', ?, ?, 'payment_rejected', 0, ?)")
            ->execute([$paymentRequest['requester_id'], "Your request for " . $paymentRequest['amount'] . " EGP was rejected", $paymentRequest['amount'], $request_id]);
    }

    // 6. تحديث حالة الطلب والإشعار الوارد
    $pdo->prepare("UPDATE payment_requests SET status = ? WHERE id = ?")->execute([$status, $request_id]);
    $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE id = ?")->execute([$notification_id]);

    $pdo->commit();
    echo json_encode(["status" => "success", "message" => "Transaction completed!"]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}