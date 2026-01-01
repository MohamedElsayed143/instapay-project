<?php
$host = getenv('DB_HOST') ?: "mysql-1fa39a1d-mohamed-elsayed.l.aivencloud.com";
$port = getenv('DB_PORT') ?: "12068"; 
$db   = getenv('DB_NAME') ?: "defaultdb";
$user = getenv('DB_USER') ?: "avnadmin";
$pass = getenv('DB_PASS') ?: ""; // اتركها فارغة هنا

try {
    $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
    ]);
} catch (PDOException $e) {
    error_log("Connection Error: " . $e->getMessage());
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database Connection Error"]);
    exit;
}
