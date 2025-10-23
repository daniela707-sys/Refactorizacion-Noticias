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
$estado = isset($data['estado']) ? $data['estado'] : 'Publicado';
$buscar = isset($data['buscar']) ? $data['buscar'] : NULL;

// ✅ NUEVO: Parámetro para controlar boletines por rango de fechas
$fechaDesde = isset($data['fecha_desde']) ? $data['fecha_desde'] : NULL;
$fechaHasta = isset($data['fecha_hasta']) ? $data['fecha_hasta'] : NULL;
$mostrarArchivados = isset($data['incluir_archivados']) ? boolval($data['incluir_archivados']) : false;

// Verificar que el campo de ordenamiento sea seguro
$ordenPermitidos = ['fecha_publicacion', 'titulo', 'created_at', 'updated_at'];
if (!in_array($orden, $ordenPermitidos)) {
    $orden = 'fecha_publicacion'; // Valor por defecto si no es válido
}

// Verificar dirección
$direccionPermitida = ['ASC', 'DESC'];
if (!in_array($direccion, $direccionPermitida)) {
    $direccion = 'DESC'; // Valor por defecto para mostrar los más recientes primero
}

// Consulta base con JOIN para traer el nombre del municipio
$query = "
SELECT 
    boletines_sena.*, 
    municipio.municipio AS nombre_municipio
FROM boletines_sena
LEFT JOIN municipio ON boletines_sena.municipio = municipio.idmuni
WHERE 1=1";

// ✅ Filtros de estado
if (!$mostrarArchivados) {
    // Por defecto, excluir boletines archivados
    $query .= " AND boletines_sena.estado != 'Archivado'";
}

if ($estado !== NULL && $estado !== 'TODOS') {
    $estado = str_replace("'", "''", $estado);
    $query .= " AND boletines_sena.estado = '" . $estado . "'";
}

// ✅ Filtros de fecha
if ($fechaDesde !== NULL) {
    $fechaDesde = str_replace("'", "''", $fechaDesde);
    $query .= " AND boletines_sena.fecha_publicacion >= '" . $fechaDesde . "'";
}

if ($fechaHasta !== NULL) {
    $fechaHasta = str_replace("'", "''", $fechaHasta);
    $query .= " AND boletines_sena.fecha_publicacion <= '" . $fechaHasta . "'";
}

// Agregar filtros existentes
if ($departamento !== NULL && $departamento !== 'TODOS') {
    $departamento = str_replace("'", "''", $departamento);
    $query .= " AND boletines_sena.departamento = '" . $departamento . "'";
}

if ($buscar !== NULL) {
    $buscar = str_replace("'", "''", $buscar);
    $query .= " AND (boletines_sena.titulo LIKE '%" . $buscar . "%' OR boletines_sena.contenido LIKE '%" . $buscar . "%')";
}

// Agregar ordenamiento y paginación
$offset = $pagina * $limite;
$query .= " ORDER BY boletines_sena.`$orden` $direccion LIMIT $limite OFFSET $offset";

// Ejecutar consulta
$result = DB::Query($query);
$boletines = array();

if ($result) {
    while ($row = $result->fetchAssoc()) {
        // Agregar campos calculados útiles
        $row['resumen'] = mb_substr(strip_tags($row['contenido']), 0, 150) . '...';
        $row['dias_desde_publicacion'] = floor((time() - strtotime($row['fecha_publicacion'])) / (60 * 60 * 24));
        $boletines[] = $row;
    }
}

// ✅ CONSULTA PARA EL TOTAL CON LOS MISMOS FILTROS
$queryTotal = "
SELECT COUNT(boletines_sena.id_boletin) as total 
FROM boletines_sena
LEFT JOIN municipio ON boletines_sena.municipio = municipio.idmuni
WHERE 1=1";

// Aplicar los mismos filtros para el conteo
if (!$mostrarArchivados) {
    $queryTotal .= " AND boletines_sena.estado != 'Archivado'";
}

if ($estado !== NULL && $estado !== 'TODOS') {
    $queryTotal .= " AND boletines_sena.estado = '" . $estado . "'";
}

if ($fechaDesde !== NULL) {
    $queryTotal .= " AND boletines_sena.fecha_publicacion >= '" . $fechaDesde . "'";
}

if ($fechaHasta !== NULL) {
    $queryTotal .= " AND boletines_sena.fecha_publicacion <= '" . $fechaHasta . "'";
}

if ($departamento !== NULL && $departamento !== 'TODOS') {
    $queryTotal .= " AND boletines_sena.departamento = '" . $departamento . "'";
}

if ($buscar !== NULL) {
    $queryTotal .= " AND (boletines_sena.titulo LIKE '%" . $buscar . "%' OR boletines_sena.contenido LIKE '%" . $buscar . "%')";
}

$resultTotal = DB::Query($queryTotal);
$total = 0;
if ($resultTotal && $rowTotal = $resultTotal->fetchAssoc()) {
    $total = $rowTotal['total'];
}

// ✅ CONSULTAS ADICIONALES: Estadísticas útiles
$queryEstadisticas = "
SELECT 
    estado,
    COUNT(*) as cantidad
FROM boletines_sena 
WHERE 1=1";

if ($departamento !== NULL && $departamento !== 'TODOS') {
    $queryEstadisticas .= " AND departamento = '" . $departamento . "'";
}

$queryEstadisticas .= " GROUP BY estado";

$resultEstadisticas = DB::Query($queryEstadisticas);
$estadisticas = array();
if ($resultEstadisticas) {
    while ($row = $resultEstadisticas->fetchAssoc()) {
        $estadisticas[$row['estado']] = intval($row['cantidad']);
    }
}

// Consulta para boletines recientes (últimos 30 días)
$queryRecientes = "
SELECT COUNT(*) as total_recientes 
FROM boletines_sena 
WHERE fecha_publicacion >= DATE_SUB(NOW(), INTERVAL 30 DAY) 
AND estado = 'Publicado'";

if ($departamento !== NULL && $departamento !== 'TODOS') {
    $queryRecientes .= " AND departamento = '" . $departamento . "'";
}

$resultRecientes = DB::Query($queryRecientes);
$totalRecientes = 0;
if ($resultRecientes && $rowRecientes = $resultRecientes->fetchAssoc()) {
    $totalRecientes = $rowRecientes['total_recientes'];
}

// Devolver resultados
echo json_encode([
    'success' => true,
    'total' => $total,
    'boletines' => $boletines,
    'estadisticas' => $estadisticas,
    'total_recientes' => $totalRecientes,
    'filtros_aplicados' => [
        'departamento' => $departamento,
        'estado' => $estado,
        'fecha_desde' => $fechaDesde,
        'fecha_hasta' => $fechaHasta,
        'incluir_archivados' => $mostrarArchivados,
        'buscar' => $buscar
    ],
    'paginacion' => [
        'pagina_actual' => $pagina,
        'limite' => $limite,
        'total_paginas' => ceil($total / $limite)
    ],
    'debug' => [
        'query' => $query,
        'countQuery' => $queryTotal,
        'orden' => $orden,
        'direccion' => $direccion
    ]
]);
?>