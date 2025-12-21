<?php
// إعدادات CORS للسماح بالوصول من React
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

require_once "../config/db.php";

$user_id = isset($_GET["user_id"]) ? intval($_GET["user_id"]) : null;

if (!$user_id) {
    echo json_encode(["status" => "error", "message" => "user_id is required"]);
    exit;
}

try {
    // 1. جلب الإشعارات كالمعتاد
    $stmt = $pdo->prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$user_id]);
    
    $notifications = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $notifications[] = [
            "id" => (int)$row["id"],
            "request_id" => isset($row["request_id"]) ? (int)$row["request_id"] : null,
            "title" => $row["title"],
            "description" => $row["description"],
            "amount" => $row["amount"],
            "type" => $row["type"],
            "created_at" => $row["created_at"],
            "is_read" => (int)$row["is_read"]
        ];
    }

    // 2. التعديل السحري: تحديث حالة الإشعارات العادية لتصبح مقروءة فوراً
    // استثنينا 'payment_request' لكي يظل التنبيه موجوداً حتى يضغط المستخدم على قبول أو رفض
    $updateStmt = $pdo->prepare("
        UPDATE notifications 
        SET is_read = 1 
        WHERE user_id = ? 
        AND is_read = 0 
        AND type != 'payment_request'
    ");
    $updateStmt->execute([$user_id]);

    echo json_encode([
        "status" => "success", 
        "notifications" => $notifications
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>