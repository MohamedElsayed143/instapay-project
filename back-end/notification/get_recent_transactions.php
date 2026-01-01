<?php
// السماح بالوصول من أي مصدر (CORS Fix)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// التعامل مع طلب الـ Preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . "/../config/db.php";

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;

if (!$user_id) {
    echo json_encode(["status" => "error", "message" => "User ID is missing"]);
    exit;
}

try {
    /**
     * الاستعلام لجلب العمليات مع ربط الأسماء لضمان عدم ظهور null
     */
    $stmt = $pdo->prepare("
        SELECT 
            t.id, 
            t.amount, 
            t.created_at,
            t.type,
            t.account_reference,
            -- جلب الاسم بشكل ذكي
            CASE 
                WHEN t.type = 'bill' THEN t.service_name
                WHEN t.sender_id = ? THEN COALESCE(u_receiver.full_name, t.receiver_phone, 'Recipient')
                WHEN t.receiver_id = ? THEN COALESCE(u_sender.full_name, 'Sender')
                ELSE 'Transaction'
            END as display_name,
            -- تحديد الاتجاه
            CASE 
                WHEN t.sender_id = ? THEN 'sent' 
                WHEN t.receiver_id = ? THEN 'received' 
                ELSE 'bill'
            END as direction
        FROM transactions t
        LEFT JOIN users u_sender ON t.sender_id = u_sender.id
        LEFT JOIN users u_receiver ON t.receiver_id = u_receiver.id
        WHERE t.sender_id = ? OR t.receiver_id = ?
        ORDER BY t.created_at DESC 
        LIMIT 10
    ");
    
    $stmt->execute([$user_id, $user_id, $user_id, $user_id, $user_id, $user_id]);
    $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "transactions" => $transactions
    ]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database Error: " . $e->getMessage()]);
}
?>