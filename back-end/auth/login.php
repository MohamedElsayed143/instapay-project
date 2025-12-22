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
$phone    = $data["phone"] ?? "";
$password = $data["password"] ?? "";

// بدلاً من http_response_code(400)
if (!$phone || !$password) {
    echo json_encode([
        "status" => "error", 
        "message" => "Mobile number and password required"
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE phone = ?");
    $stmt->execute([$phone]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user["password"])) {
        // حالة النجاح (ستبقى كما هي)
        echo json_encode([
            "status" => "success",
            "message" => "Login successful",
            "user" => [
                "id" => $user["id"],
                "name" => $user["full_name"],
                "balance" => $user["balance"] ?? 0,
                "role" => $user["role"]
            ]
        ]);
    } else {
        // تم إلغاء http_response_code(401) لضمان أن res.ok في الفرونت اند لا تفشل
        echo json_encode([
            "status" => "error", 
            "message" => "Incorrect login details"
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "status" => "error", 
        "message" => "Server error"
    ]);
}