<?php
// إعدادات الـ CORS للسماح بالاتصال من الفرونت إند
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// التعامل مع طلب التحقق Preflight للمتصفحات
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . "/../config/db.php";
require_once __DIR__ . "/../config/lang.php";

// استقبال البيانات بصيغة JSON
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['action']) || !isset($data['user_id'])) {
    echo json_encode(["status" => "error", "message" => __("invalid_request")]);
    exit;
}

$action = $data['action'];
$userId = $data['user_id'];

try {
    // 1. تحديث الاسم
    if ($action === "update_name") {
        $newName = trim($data['name'] ?? ""); 
        if (empty($newName)) throw new Exception(__("all_fields_required"));

        $stmt = $pdo->prepare("UPDATE users SET full_name = ? WHERE id = ?");
        $stmt->execute([$newName, $userId]);
        
        echo json_encode(["status" => "success", "message" => __("name_updated")]);

    // 2. تغيير كلمة المرور
    } elseif ($action === "change_password") {
        $oldPass = trim($data['oldPassword'] ?? "");
        $newPass = trim($data['newPassword'] ?? "");

        if (empty($oldPass) || empty($newPass)) {
            throw new Exception(__("all_fields_required"));
        }

        // جلب كلمة المرور المخزنة للتأكد من الهوية
        $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();

        if ($user) {
            $storedPass = $user['password'];
            
            // التحقق من كلمة المرور الحالية
            $isCorrect = false;
            if (password_verify($oldPass, $storedPass)) {
                $isCorrect = true;
            } elseif ($oldPass === $storedPass) {
                $isCorrect = true; 
            }

            if (!$isCorrect) {
                echo json_encode(["status" => "error", "message" => __("current_password_incorrect")]);
                exit;
            }

            // --- التعديل المطلوب: منع استخدام نفس الباسورد الحالي ---
            if ($oldPass === $newPass) {
                echo json_encode([
                    "status" => "error", 
                    "message" => __("new_password_same")
                ]);
                exit;
            }

            // تحديث كلمة المرور مع تشفيرها
            $hashedNewPass = password_hash($newPass, PASSWORD_DEFAULT);
            $update = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
            $update->execute([$hashedNewPass, $userId]);
            
            echo json_encode(["status" => "success", "message" => __("password_changed")]);
        } else {
            throw new Exception(__("user_not_found"));
        }
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
