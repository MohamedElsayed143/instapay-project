<?php
require_once '../config/db.php';
// تأكد أن auth.php ترجع بيانات المستخدم بشكل صحيح
require_once '../middleware/auth.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// التحقق من الهوية
$user = authenticate(); 
$userId = $user['id']; 

$data = json_decode(file_get_contents("php://input"), true);
$action = $data['action'] ?? '';

if (!$action) {
    echo json_encode(["status" => "error", "message" => "Action not specified"]);
    exit;
}

try {
    switch ($action) {
        case 'update_name':
            // تم تغيير name إلى full_name بناءً على صورة قاعدة البيانات الخاصة بك
            $stmt = $pdo->prepare("UPDATE users SET full_name = ? WHERE id = ?");
            $stmt->execute([$data['name'], $userId]);
            echo json_encode(["status" => "success", "message" => "Name updated successfully"]);
            break;

        case 'change_password':
            $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            $userData = $stmt->fetch();
            
            if (password_verify($data['oldPassword'], $userData['password'])) {
                $newHash = password_hash($data['newPassword'], PASSWORD_BCRYPT);
                $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
                $stmt->execute([$newHash, $userId]);
                echo json_encode(["status" => "success", "message" => "Password changed successfully"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Current password is incorrect"]);
            }
            break;

        case 'delete_account':
            $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            echo json_encode(["status" => "success", "message" => "Account deleted permanently"]);
            break;

        default:
            echo json_encode(["status" => "error", "message" => "Invalid action"]);
            break;
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}