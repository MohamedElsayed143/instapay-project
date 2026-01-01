<?php
// قراءة البيانات من البيئة (Environment Variables) أو استخدام القيم المحلية كاحتياطي
$host = getenv('DB_HOST') ?: "localhost";
$db   = getenv('DB_NAME') ?: "instapay";
$user = getenv('DB_USER') ?: "root";
$pass = getenv('DB_PASS') ?: "";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$db;charset=utf8",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    // إظهار رسالة الخطأ الحقيقية في مرحلة التطوير فقط، وفي الـ Production نكتفي برسالة عامة
    http_response_code(500);
    echo json_encode(["error" => "DB Connection Failed: " . $e->getMessage()]);
    exit;
}