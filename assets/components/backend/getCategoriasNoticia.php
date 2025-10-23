<?php
@ini_set("display_errors", "1");
require_once("../../../../include/dbcommon.php");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

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
?>