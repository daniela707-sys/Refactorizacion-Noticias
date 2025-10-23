# Módulo de Noticias - Red Emprender

## Descripción General

Sistema de gestión y visualización de noticias desarrollado en PHP y JavaScript para la plataforma Red Emprender. Permite la consulta, filtrado, paginación y visualización detallada de noticias con soporte para categorías, departamentos y búsqueda avanzada.

## Estructura de Archivos

### Backend (PHP)
```
assets/components/backend/
├── getNoticias.php          # Obtiene listado de noticias con filtros
├── getDetalleNoticia.php    # Obtiene detalle de una noticia específica
├── getCategoriasNoticia.php # Obtiene categorías disponibles
└── getBannerNoticia.php     # Obtiene imágenes de banner
```

### Frontend (JavaScript)
```
assets/js/
├── index.js                 # Lógica principal del listado de noticias
└── detalles_noticia.js      # Lógica de la página de detalle
```

### Páginas Principales
```
├── index.php               # Página principal con listado de noticias
├── detalle_noticia.php     # Página de detalle de noticia
└── assets/components/
    ├── noticias_handler.php # Componente del listado
    └── detalle_noticia.php  # Componente del detalle
```

### Configuración
```
├── include/dbcommon.php    # Configuración de base de datos
└── config/config_globales.php # Configuraciones globales
```

## Funciones Principales

### 1. Listado de Noticias (`getNoticias.php`)
- Paginación configurable
- Filtros por departamento, categoría, fechas
- Búsqueda por título y contenido
- Ordenamiento por fecha, título, autor
- Soporte para GET y POST

### 2. Detalle de Noticia (`getDetalleNoticia.php`)
- Obtiene información completa de una noticia
- Incluye datos de categoría mediante JOIN
- Validación de ID de noticia

### 3. Gestión de Categorías (`getCategoriasNoticia.php`)
- Lista todas las categorías disponibles
- Ordenamiento alfabético

### 4. Banner Dinámico (`getBannerNoticia.php`)
- Obtiene imágenes para banners
- Filtro por ubicación (NOTICIAS)

## Ejemplos de Uso

### Cargar Noticias con Filtros
```javascript
const requestBody = {
    limite: 6,
    pagina: 0,
    orden: 'fecha_publicacion',
    direccion: 'DESC',
    departamento: 'ANTIOQUIA',
    categoria: 1,
    buscar: 'emprendimiento',
    fecha_desde: '2024-01-01',
    fecha_hasta: '2024-12-31'
};

fetch('assets/components/backend/getNoticias.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
})
.then(response => response.json())
.then(data => {
    console.log(data.noticias);
});
```

### Obtener Detalle de Noticia
```javascript
fetch('assets/components/backend/getDetalleNoticia.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: 123 })
})
.then(response => response.json())
.then(data => {
    console.log(data.noticia);
});
```

### Cargar Categorías
```javascript
fetch('assets/components/backend/getCategoriasNoticia.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
})
.then(response => response.json())
.then(data => {
    console.log(data.categorias);
});
```

## Parámetros de Peticiones AJAX

### getNoticias.php
| Parámetro | Tipo | Descripción | Valor por Defecto |
|-----------|------|-------------|-------------------|
| `limite` | int | Número de noticias por página | 8 |
| `pagina` | int | Página actual (0-indexed) | 0 |
| `orden` | string | Campo de ordenamiento | 'fecha_publicacion' |
| `direccion` | string | Dirección del orden (ASC/DESC) | 'DESC' |
| `departamento` | string | Filtro por departamento | NULL |
| `categoria` | int | ID de categoría | NULL |
| `buscar` | string | Término de búsqueda | NULL |
| `fecha_desde` | string | Fecha inicio (YYYY-MM-DD) | NULL |
| `fecha_hasta` | string | Fecha fin (YYYY-MM-DD) | NULL |

### getDetalleNoticia.php
| Parámetro | Tipo | Descripción | Requerido |
|-----------|------|-------------|-----------|
| `id` | int | ID de la noticia | Sí |

### getBannerNoticia.php
| Parámetro | Tipo | Descripción | Valor por Defecto |
|-----------|------|-------------|-------------------|
| `ubicacion` | string | Ubicación del banner | 'NOTICIAS' |

## Formato de Respuestas Esperadas

### getNoticias.php
```json
{
    "success": true,
    "total": 25,
    "noticias": [
        {
            "id": 1,
            "titulo": "Título de la noticia",
            "contenido": "Contenido completo...",
            "extracto": "Resumen breve...",
            "imagen": "[{\"name\":\"ruta/imagen.jpg\"}]",
            "autor": "Nombre Autor",
            "fecha_publicacion": "2024-01-15 10:30:00",
            "departamento": "ANTIOQUIA",
            "categoria": 1,
            "nombre_categoria": "Emprendimiento"
        }
    ]
}
```

### getDetalleNoticia.php
```json
{
    "success": true,
    "noticia": {
        "id": 1,
        "titulo": "Título de la noticia",
        "contenido": "Contenido completo de la noticia...",
        "imagen": "[{\"name\":\"ruta/imagen.jpg\"}]",
        "autor": "Nombre Autor",
        "fecha_publicacion": "2024-01-15 10:30:00",
        "departamento": "ANTIOQUIA",
        "categoria": 1,
        "nombre_categoria": "Emprendimiento"
    }
}
```

### getCategoriasNoticia.php
```json
{
    "success": true,
    "categorias": [
        {
            "id": 1,
            "nombre": "Emprendimiento"
        },
        {
            "id": 2,
            "nombre": "Tecnología"
        }
    ]
}
```

### getBannerNoticia.php
```json
{
    "success": true,
    "total": 1,
    "fotos": [
        {
            "id": 1,
            "foto": "[{\"name\":\"ruta/banner.jpg\"}]",
            "ubicacion": "NOTICIAS"
        }
    ]
}
```

### Respuestas de Error
```json
{
    "success": false,
    "error": "Descripción del error"
}
```

## Características Técnicas

- **Seguridad**: Validación de parámetros y escape de caracteres especiales
- **Paginación**: Sistema completo con información de totales
- **Filtros**: Múltiples criterios de búsqueda combinables
- **Imágenes**: Soporte para arrays JSON de imágenes
- **Responsive**: Interfaz adaptable a diferentes dispositivos
- **CORS**: Headers configurados para peticiones cross-origin
- **Fallbacks**: Manejo de errores con contenido por defecto

## Dependencias

- PHP 7.0+
- MySQL/MariaDB
- jQuery 3.6.0
- Bootstrap 4.5+
- FontAwesome
- Librerías adicionales en `assets/vendors/`

## Instalación

1. Configurar base de datos en `include/dbcommon.php`
2. Asegurar permisos de lectura en directorio `assets/`
3. Verificar configuración de servidor web para archivos PHP
4. Cargar dependencias JavaScript en el orden correcto

## Notas de Desarrollo

- Las imágenes se almacenan como JSON arrays en la base de datos
- El sistema soporta tanto rutas locales como de producción
- Los filtros se mantienen en la URL para navegación directa
- Implementa skeleton loading para mejor UX
- Manejo de estados de carga y error en todas las operaciones