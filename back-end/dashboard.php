<?php
header("Content-Type: application/json");
require_once "middleware/auth.php";

echo json_encode([
    "message" => "Welcome to dashboard",
    "user_id" => $_SESSION["user_id"]
]);
