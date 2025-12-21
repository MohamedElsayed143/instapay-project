<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
include_once '../config/db.php';

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id)) {
    $sql = "DELETE FROM users WHERE id = $data->id";
    if(mysqli_query($conn, $sql)) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error"]);
    }
}
?>