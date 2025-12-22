<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

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
    // نرسل status => error ليظهر اللون الأحمر في الفرونت
    echo json_encode([
        "status" => "error",
        "message" => "All fields are required"
    ]);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

try {
    $stmt = $pdo->prepare(
        "INSERT INTO users (full_name, phone, password, role) VALUES (?, ?, ?, 'user')"
    );
    $stmt->execute([$fullName, $phone, $hashedPassword]);

    // الإضافة الحاسمة: status => success لضمان ظهور اللون الأخضر
    echo json_encode([
        "status" => "success",
        "message" => "Account created successfully"
    ]);

} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        echo json_encode([
            "status" => "error",
            "message" => "The mobile number is already registered"
        ]);
    } else {
        echo json_encode([
            "status" => "error", 
            "message" => "Server error: " . $e->getMessage()
        ]);
    }
}