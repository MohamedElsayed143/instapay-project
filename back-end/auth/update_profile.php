<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once __DIR__ . "/../config/db.php";

$data = json_decode(file_get_contents("php://input"), true);

// التحقق من وجود المعرف والأكشن
if (!isset($data['user_id']) || !isset($data['action'])) {
    echo json_encode(["status" => "error", "message" => "Invalid Request"]);
    exit;
}

$userId = $data['user_id'];
$action = $data['action'];

try {
    switch ($action) {
        case 'update_name':
            $newName = trim($data['name'] ?? "");
            if (empty($newName)) throw new Exception("Name cannot be empty");
            
            $stmt = $pdo->prepare("UPDATE users SET full_name = ? WHERE id = ?");
            $stmt->execute([$newName, $userId]);
            echo json_encode(["status" => "success", "message" => "Name updated"]);
            break;

        case 'change_password':
            $oldPass = $data['oldPassword'] ?? "";
            $newPass = $data['newPassword'] ?? "";

            $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch();

            if ($user && (password_verify($oldPass, $user['password']) || $oldPass === $user['password'])) {
                if ($oldPass === $newPass) throw new Exception("New password must be different");
                
                $hashedPass = password_hash($newPass, PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
                $stmt->execute([$hashedPass, $userId]);
                echo json_encode(["status" => "success", "message" => "Password changed"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Current password incorrect"]);
            }
            break;

        case 'delete_account':
            $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            echo json_encode(["status" => "success", "message" => "Account deleted"]);
            break;

        default:
            throw new Exception("Unknown action");
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}