<?php
@ini_set("display_errors", "0");
error_reporting(0);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

try {
    require_once("../../../../include/dbcommon.php");
} catch (Exception $e) {
    echo json_encode(['categorias' => []]);
    exit;
}

try {
    $query = "select DISTINCT c.id_categoria, c.nombre FROM categoria c INNER JOIN productos p ON p.categoria = c.id_categoria WHERE p.estado = 1 and c.estado = 1 ORDER BY c.nombre ASC;";
    $result = DB::Query($query);
    $categorias = array();

    if ($result) {
        while ($row = $result->fetchAssoc()) {
            $categorias[] = $row;
        }
    }

    echo json_encode(["categorias" => $categorias]);
} catch (Exception $e) {
    echo json_encode(['categorias' => []]);
}
