<?php
header("Access-Control-Allow-Origin: *"); // للسماح بالرفع من أي مكان أثناء التطوير
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once "../config/db.php";

if (!isset($_FILES['avatar']) || !isset($_POST['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Missing file or user ID"]);
    exit;
}

$userId = $_POST['user_id'];
// اجعل المسار داخل مجلد public في الـ backend أو مجلد يمكن الوصول إليه عبر URL
$uploadDir = "../uploads/avatars/"; 

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$file = $_FILES['avatar'];
$ext = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
$newFileName = "avatar_" . $userId . "_" . time() . "." . $ext;
$targetPath = $uploadDir . $newFileName;

$allowed = ['jpg', 'jpeg', 'png', 'gif'];

if (in_array($ext, $allowed)) {
    if (move_uploaded_file($file["tmp_name"], $targetPath)) {
        // تحديث قاعدة البيانات باسم الملف فقط
        $stmt = $pdo->prepare("UPDATE users SET avatar = ? WHERE id = ?");
        $stmt->execute([$newFileName, $userId]);

        echo json_encode([
            "status" => "success",
            "message" => "Avatar updated",
            "avatar" => $newFileName
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Upload failed"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid file type"]);
}