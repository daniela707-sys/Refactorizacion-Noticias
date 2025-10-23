<?php
@ini_set("display_errors", "1");
require_once("../../../../include/dbcommon.php");
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Obtener los datos de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

// Preparar parámetros
$departamento = isset($data['departamento']) && !empty($data['departamento']) ? $data['departamento'] : NULL;
$limite = isset($data['limite']) ? intval($data['limite']) : 8;
$pagina = isset($data['pagina']) ? intval($data['pagina']) : 0;
$orden = isset($data['orden']) ? $data['orden'] : 'fecha_publicacion';
$direccion = isset($data['direccion']) ? $data['direccion'] : 'DESC';
$categoria = isset($data['categoria']) ? $data['categoria'] : NULL;
$buscar = isset($data['buscar']) ? $data['buscar'] : NULL;

// Capturar los parámetros de fecha
$fechaDesde = isset($data['fecha_desde']) && !empty($data['fecha_desde']) ? $data['fecha_desde'] : NULL;
$fechaHasta = isset($data['fecha_hasta']) && !empty($data['fecha_hasta']) ? $data['fecha_hasta'] : NULL;

// CORREGIR: Si viene fecha_creacion, convertirlo a fecha_publicacion
if ($orden === 'fecha_creacion') {
    $orden = 'fecha_publicacion';
}

// Verificar que el campo de ordenamiento sea seguro (solo campos que existen en la tabla)
$ordenPermitidos = ['fecha_publicacion', 'titulo', 'autor', 'id'];
if (!in_array($orden, $ordenPermitidos)) {
    $orden = 'fecha_publicacion';
}

// Verificar dirección
$direccionPermitida = ['ASC', 'DESC'];
if (!in_array($direccion, $direccionPermitida)) {
    $direccion = 'DESC';
}

// Consulta base con JOIN para traer el nombre de la categoría
$query = "
SELECT 
    noticias.*, 
    categorias_noticias.nombre AS nombre_categoria
FROM noticias
LEFT JOIN categorias_noticias ON noticias.categoria = categorias_noticias.id
WHERE 1=1";

// Agregar filtros
if ($departamento !== NULL && $departamento !== 'TODOS') {
    $departamento = str_replace("'", "''", $departamento);
    $query .= " AND noticias.departamento = '" . $departamento . "'";
}

if ($categoria !== NULL) {
    $query .= " AND noticias.categoria = " . intval($categoria);
}

if ($buscar !== NULL) {
    $buscar = str_replace("'", "''", $buscar);
    $query .= " AND (noticias.titulo LIKE '%" . $buscar . "%' OR noticias.contenido LIKE '%" . $buscar . "%')";
}

// Filtros de fecha
if ($fechaDesde !== NULL) {
    $fechaDesde = str_replace("'", "''", $fechaDesde);
    $query .= " AND DATE(noticias.fecha_publicacion) >= '" . $fechaDesde . "'";
}

if ($fechaHasta !== NULL) {
    $fechaHasta = str_replace("'", "''", $fechaHasta);
    $query .= " AND DATE(noticias.fecha_publicacion) <= '" . $fechaHasta . "'";
}

// Agregar ordenamiento y paginación
$offset = $pagina * $limite;
$query .= " ORDER BY noticias.`$orden` $direccion LIMIT $limite OFFSET $offset";

// Ejecutar consulta
$result = DB::Query($query);
$noticias = array();

if ($result) {
    while ($row = $result->fetchAssoc()) {
        $noticias[] = $row;
    }
}

// Consulta para el total de registros (sin LIMIT, con filtros)
$queryTotal = "
SELECT COUNT(noticias.id) as total 
FROM noticias
LEFT JOIN categorias_noticias ON noticias.categoria = categorias_noticias.id
WHERE 1=1";

// Aplicar los mismos filtros en la consulta de conteo
if ($departamento !== NULL && $departamento !== 'TODOS') {
    $queryTotal .= " AND noticias.departamento = '" . $departamento . "'";
}
if ($categoria !== NULL) {
    $queryTotal .= " AND noticias.categoria = " . intval($categoria);
}
if ($buscar !== NULL) {
    $queryTotal .= " AND (noticias.titulo LIKE '%" . $buscar . "%' OR noticias.contenido LIKE '%" . $buscar . "%')";
}

// Filtros de fecha en la consulta de conteo
if ($fechaDesde !== NULL) {
    $queryTotal .= " AND DATE(noticias.fecha_publicacion) >= '" . $fechaDesde . "'";
}

if ($fechaHasta !== NULL) {
    $queryTotal .= " AND DATE(noticias.fecha_publicacion) <= '" . $fechaHasta . "'";
}

$resultTotal = DB::Query($queryTotal);
$total = 0;
if ($resultTotal && $rowTotal = $resultTotal->fetchAssoc()) {
    $total = $rowTotal['total'];
}

// Devolver resultados
echo json_encode([
    'success' => true,
    'total' => $total,
    'noticias' => $noticias,
    'debug' => [
        'query' => $query,
        'countQuery' => $queryTotal,
        'parametros_recibidos' => $data,
        'fechaDesde' => $fechaDesde,
        'fechaHasta' => $fechaHasta,
        'orden_corregido' => $orden
    ]
]);
?>