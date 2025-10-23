<?php
@ini_set("display_errors", "0");
error_reporting(0);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

try {
    require_once("../../../include/dbcommon.php");
} catch (Exception $e) {
    echo json_encode(["publicidad" => []]);
    exit;
}

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $departamento = isset($data['departamento']) ? "'" . $data['departamento'] . "'" : 'NULL';

    $query = "select * from banner_publicitario where departamento = $departamento AND estado = 1 LIMIT 1";
    $result = DB::Query($query);
    $publicidad = array();

    if ($result) {
        while ($row = $result->fetchAssoc()) {
            $publicidad = $row;
        }
    }

    echo json_encode(["publicidad" => $publicidad]);
} catch (Exception $e) {
    echo json_encode(["publicidad" => []]);
}
