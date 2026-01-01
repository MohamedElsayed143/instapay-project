<?php
header("Content-Type: application/json");
echo json_encode([
    "status" => "running",
    "message" => "InstaPay Backend API is online",
    "endpoints" => [
        "auth" => [
            "login" => "/auth/login.php",
            "signup" => "/auth/signup.php",
            "get_user" => "/auth/get_user.php"
        ],
        "admin" => [
            "stats" => "/admin/get_stats.php",
            "users" => "/admin/get_all_users.php"
        ]
    ]
]);
