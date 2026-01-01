<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit;

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../config/lang.php";

$userId = $_GET['user_id'] ?? null;

if (!$userId) {
    echo json_encode(["status" => "error", "message" => __("user_id_required"), "bills" => []]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT 
            id, 
            amount, 
            COALESCE(service_name, 'Utility Bill') as service_name, 
            COALESCE(account_reference, 'N/A') as account_number, 
            created_at as payment_date 
        FROM transactions 
        WHERE (user_id = ? OR sender_id = ?) 
        AND type = 'bill'
        ORDER BY created_at DESC
    ");
    
    $stmt->execute([$userId, $userId]);
    $bills = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success", 
        "bills" => $bills ? $bills : []
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error", 
        "message" => __("server_error"), 
        "bills" => []
    ]);
}