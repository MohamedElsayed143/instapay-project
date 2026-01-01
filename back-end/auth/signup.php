<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../config/lang.php";

$data = json_decode(file_get_contents("php://input"), true);

// تأكد من مطابقة الحروف الكبيرة والصغيرة مع React
$full_name = $data["fullName"] ?? ""; 
$phone     = $data["phone"] ?? "";
$password  = $data["password"] ?? "";

if (empty($full_name) || empty($phone) || empty($password)) {
    echo json_encode([
        "status" => "error", 
        "message" => __("all_fields_required")
    ]);
    exit;
}

try {
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    // تأكد أن أسماء الأعمدة في قاعدة البيانات صحيحة (full_name, phone, password, role, balance)
    $stmt = $pdo->prepare("INSERT INTO users (full_name, phone, password, role, balance) VALUES (?, ?, ?, 'user', 5000)");
    $stmt->execute([$full_name, $phone, $hashedPassword]);

    echo json_encode([
        "status" => "success",
        "message" => __("account_created")
    ]);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        echo json_encode(["status" => "error", "message" => __("phone_already_registered")]);
    } else {
        // هذا السطر يساعدك في معرفة الخطأ الحقيقي أثناء البرمجة
        echo json_encode(["status" => "error", "message" => "Database Error: " . $e->getMessage()]);
    }
}