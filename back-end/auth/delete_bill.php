<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') exit;

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);
$billId = $data['bill_id'] ?? null;

if (!$billId) {
    echo json_encode(["status" => "error", "message" => "Bill ID is required"]);
    exit;
}

try {
    // الحذف من الجدول الرئيسي الجديد
    $stmt = $pdo->prepare("DELETE FROM transactions WHERE id = ? AND type = 'bill'");
    $stmt->execute([$billId]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(["status" => "success", "message" => "Bill deleted successfully"]);
    } else {
        // محاولة الحذف من الجدول القديم كدعم احتياطي
        $stmtOld = $pdo->prepare("DELETE FROM bill_payments WHERE id = ?");
        $stmtOld->execute([$billId]);
        
        if ($stmtOld->rowCount() > 0) {
            echo json_encode(["status" => "success", "message" => "Record deleted"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Record not found"]);
        }
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Server error during deletion"]);
}