<?php
@ini_set("display_errors", "0");
error_reporting(0);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

try {
    require_once(__DIR__ . "/../../../include/dbcommon.php");
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Error de conexión a la base de datos'
    ]);
    exit;
}

// Obtener los datos de la solicitud
$input = file_get_contents('php://input');
$data = $input ? json_decode($input, true) : [];

try {
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
        'fotos' => $fotos
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Error al consultar la base de datos'
    ]);
}
?>