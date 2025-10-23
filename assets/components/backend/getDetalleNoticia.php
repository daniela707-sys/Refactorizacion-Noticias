<?php
@ini_set("display_errors", "0");
error_reporting(0);

try {
    require_once("../../../include/dbcommon.php");
} catch (Exception $e) {
    header("Content-Type: application/json");
    echo json_encode([
        'success' => false,
        'error' => 'Error de conexión a la base de datos'
    ]);
    exit;
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Obtener ID desde POST JSON o GET
$id = null;

// Intentar obtener desde POST JSON
$input = file_get_contents('php://input');
if ($input) {
    $data = json_decode($input, true);
    if (isset($data['id'])) {
        $id = intval($data['id']);
    }
}

// Si no hay ID en POST, intentar desde GET
if (!$id && isset($_GET['id'])) {
    $id = intval($_GET['id']);
}

// Verificar que se proporcione el ID
if (!$id || $id <= 0) {
    echo json_encode([
        'success' => false,
        'error' => 'ID de noticia requerido'
    ]);
    exit;
}

try {
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
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Error al consultar la base de datos'
    ]);
}
?>