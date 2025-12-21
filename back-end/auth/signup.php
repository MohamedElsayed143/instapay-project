<?php
// السماح لأي مصدر بالوصول (React)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// التعامل مع طلبات Preflight للمتصفح
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

$fullName = $data["fullName"] ?? "";
$phone    = $data["phone"] ?? "";
$password = $data["password"] ?? "";

if (!$fullName || !$phone || !$password) {
    http_response_code(400);
    echo json_encode(["message" => "All fields are required"]);
    exit;
}

// تشفير كلمة المرور
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare(
        "INSERT INTO users (full_name, phone, password) VALUES (?, ?, ?)"
    );
    $stmt->execute([$fullName, $phone, $hashedPassword]);

    http_response_code(201);
    echo json_encode(["message" => "Account created successfully"]);

} catch (PDOException $e) {
    // كود الخطأ 23000 في MySQL يعني وجود قيمة مكررة (Duplicate Entry)
    if ($e->getCode() == 23000) {
        http_response_code(409); // تعارض في البيانات
        echo json_encode(["message" => "The mobile number is already registered"]);
    } else {
        http_response_code(500); // خطأ سيرفر عام
        echo json_encode(["message" => "An unexpected server error occurred"]);
    }
}