<?php
// السماح بالوصول من الفرونت إند (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../config/db.php";

// استلام user_id من الرابط
$userId = $_GET['user_id'] ?? null;

if (!$userId) {
    echo json_encode(["status" => "error", "message" => "User ID required", "bills" => []]);
    exit;
}

try {
    /**
     * التعديل الجوهري:
     * 1. البحث في عمود user_id لأن الفواتير القديمة مسجلة هناك
     * 2. إضافة sender_id لضمان جلب الفواتير الجديدة التي ستسجل مستقبلاً
     * 3. استخدام COALESCE لضمان عدم وجود قيم فارغة في الاسم
     */
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

    // إرسال البيانات حتى لو كانت المصفوفة فارغة لمنع خطأ في الفرونت إند
    echo json_encode([
        "status" => "success", 
        "bills" => $bills ? $bills : []
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error", 
        "message" => $e->getMessage(), 
        "bills" => []
    ]);
}
?>