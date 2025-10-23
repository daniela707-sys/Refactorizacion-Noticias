<?php
@ini_set("display_errors", "0");
error_reporting(0);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

try {
    require_once(__DIR__ . "/../../../include/dbcommon.php");
} catch (Exception $e) {
    echo json_encode(['success' => true, 'categorias' => []]);
    exit;
}

try {
    $query = "SELECT id, nombre FROM categorias_noticias ORDER BY nombre ASC";
    $result = DB::Query($query);
    $categorias = array();

    if ($result) {
        while ($row = $result->fetchAssoc()) {
            $categorias[] = $row;
        }
    }

    echo json_encode([
        'success' => true,
        'categorias' => $categorias
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => true, 'categorias' => []]);
}
?>