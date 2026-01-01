<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit;

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../config/lang.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['user_id'], $data['amount'], $data['service'], $data['meter'])) {
    echo json_encode(["status" => "error", "message" => __("missing_data")]);
    exit;
}

$userId = $data['user_id'];
$amount = floatval($data['amount']);
$service = $data['service'];
$meter = $data['meter'];

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("SELECT balance FROM users WHERE id = ? FOR UPDATE");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) throw new Exception(__("user_not_found"));
    
    if ($user['balance'] < $amount) {
        throw new Exception(__("insufficient_balance_with_amount") . $user['balance'] . " EGP");
    }

    $updateBalance = $pdo->prepare("UPDATE users SET balance = balance - ? WHERE id = ?");
    $updateBalance->execute([$amount, $userId]);

    // تأكد أن هذه الأعمدة (service_name, account_reference) موجودة في جدول transactions
    $insertTransaction = $pdo->prepare("
        INSERT INTO transactions 
        (user_id, sender_id, type, service_name, account_reference, amount, created_at) 
        VALUES (?, ?, 'bill', ?, ?, ?, NOW())
    ");
    $insertTransaction->execute([$userId, $userId, $service, $meter, $amount]);

    $pdo->commit();

    echo json_encode([
        "status" => "success", 
        "message" => __("payment_success"),
        "new_balance" => $user['balance'] - $amount
    ]);

} catch (Exception $e) {
    if ($pdo && $pdo->inTransaction()) $pdo->rollBack();
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}