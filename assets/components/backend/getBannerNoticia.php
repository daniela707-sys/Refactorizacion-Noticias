<?php
@ini_set("display_errors", "1");
require_once("../../../../include/dbcommon.php");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Obtener los datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

// Inicializar el array de fotos
$fotos = array();

// Consulta base con JOIN para traer el nombre del municipio
$query = "
SELECT 
    *
FROM banner_fotos
WHERE 1=1 AND ubicacion='NOTICIAS'";

// Ejecutar consulta
$result = DB::Query($query);

if ($result) {
    while ($row = $result->fetchAssoc()) {
        $fotos[] = $row;
    }
}

// Devolver resultados
echo json_encode([
    'success' => true,
    'total' => count($fotos),
    'fotos' => $fotos,
    'debug' => [
        'query' => $query
    ]
]);
?>