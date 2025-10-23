<?php
@ini_set("display_errors", "1");
require_once(".../../include/dbcommon.php");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Obtener los datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

// Verificar que se proporcione el ID
if (!isset($data['id']) || empty($data['id'])) {
    echo json_encode([
        'success' => false,
        'error' => 'ID de noticia requerido'
    ]);
    exit;
}

$id = intval($data['id']);

// Consulta para obtener la noticia con el nombre de la categoría
$query = "
SELECT 
    noticias.*, 
    categorias_noticias.nombre AS nombre_categoria
FROM noticias
LEFT JOIN categorias_noticias ON noticias.categoria = categorias_noticias.id
WHERE noticias.id = $id";

$result = DB::Query($query);

if ($result && $row = $result->fetchAssoc()) {
    echo json_encode([
        'success' => true,
        'noticia' => $row
    ]);
} else {
    echo json_encode([
        'success' => false,
        'error' => 'Noticia no encontrada'
    ]);
}
?>