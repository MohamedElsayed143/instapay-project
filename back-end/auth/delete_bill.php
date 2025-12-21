<?php
// السماح بالوصول من الفرونت إند
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit;

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

// التأكد من وصول الـ ID
if (!isset($data['bill_id'])) {
    echo json_encode(["status" => "error", "message" => "Bill ID is required"]);
    exit;
}

$billId = $data['bill_id'];

try {
    /**
     * التعديل الجوهري:
     * الحذف يجب أن يتم من جدول transactions لأننا نعرض الفواتير منه الآن
     * كما يجب التأكد أننا نحذف صف من نوع 'bill' فقط للأمان
     */
    $stmt = $pdo->prepare("DELETE FROM transactions WHERE id = ? AND type = 'bill'");
    $stmt->execute([$billId]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["status" => "success", "message" => "Bill deleted successfully"]);
    } else {
        // إذا لم يجد السجل في transactions، قد يكون مسجلاً في الجدول القديم bill_payments
        $stmtOld = $pdo->prepare("DELETE FROM bill_payments WHERE id = ?");
        $stmtOld->execute([$billId]);
        
        if ($stmtOld->rowCount() > 0) {
            echo json_encode(["status" => "success", "message" => "Activity deleted from old records"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Record not found in any table"]);
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Delete failed: " . $e->getMessage()]);
}
?>