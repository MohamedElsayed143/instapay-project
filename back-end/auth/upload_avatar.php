<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once "../config/db.php";

// التأكد من وجود ملف ومعرف مستخدم
if (!isset($_FILES['avatar']) || !isset($_POST['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Missing data"]);
    exit;
}

$userId = $_POST['user_id'];
$file = $_FILES['avatar'];
$uploadDir = "../uploads/avatars/";

// إنشاء المجلد إذا لم يكن موجوداً
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$fileName = time() . "_" . basename($file["name"]);
$targetFilePath = $uploadDir . $fileName;
$fileType = pathinfo($targetFilePath, PATHINFO_EXTENSION);

// التحقق من نوع الملف
$allowTypes = array('jpg', 'png', 'jpeg', 'gif');
if (in_array(strtolower($fileType), $allowTypes)) {
    if (move_uploaded_file($file["tmp_name"], $targetFilePath)) {
        // تحديث قاعدة البيانات برابط الصورة النسبي
        $avatarUrl = "auth/uploads/avatars/" . $fileName; // عدل المسار حسب إعدادات السيرفر
        $stmt = $pdo->prepare("UPDATE users SET avatar = ? WHERE id = ?");
        $stmt->execute([$fileName, $userId]);

        echo json_encode([
            "status" => "success", 
            "message" => "Upload successful",
            "avatar" => $fileName
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to move file"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid file type"]);
}