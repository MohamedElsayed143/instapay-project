<?php
// قراءة البيانات من البيئة (Environment Variables) 
$host = getenv('DB_HOST') ?: "localhost";
$port = getenv('DB_PORT') ?: "3306"; // ضيف السطر ده عشان Aiven بيستخدم 12068
$db   = getenv('DB_NAME') ?: "instapay";
$user = getenv('DB_USER') ?: "root";
$pass = getenv('DB_PASS') ?: "";

try {
    // تعديل سطر الـ PDO ليشمل المنفذ والـ SSL
    $pdo = new PDO(
        "mysql:host=$host;port=$port;dbname=$db;charset=utf8",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::MYSQL_ATTR_SSL_CA => true // ضروري جداً لـ Aiven
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "DB Connection Failed: " . $e->getMessage()]);
    exit;
}