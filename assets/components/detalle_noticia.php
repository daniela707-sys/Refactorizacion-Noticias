<?php
$id_noticia = isset($_GET['id']) ? $_GET['id'] : null;
?>

<style>
    .banner {
        height: 60vh;
        background-size: cover;
        background-position: center;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        text-align: center;
        padding: 20px;
        transition: background-image 1s ease-in-out;
        width: 100%;
    }
    
    .banner::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 0;
    }
    
    .banner-content {
        position: relative;
        z-index: 1;
        max-width: 1000px;
    }
    
    .banner h1 {
        font-size: 4rem;
        margin-bottom: 20px;
        color: rgb(255, 255, 255);
    }
    
    .banner p {
        font-size: 1.5rem;
        margin-bottom: 30px;
        color: white;
    }
    
    #main-content {
        display: block !important;
        visibility: visible !important;
        min-height: 500px;
        position: relative;
        z-index: 10;
        background: white;
        padding: 40px 0;
    }
    
    /* Skeleton loader styles */
    .skeleton-line,
    .skeleton-image-main,
    .skeleton-circle {
        background-color: #f0f0f0;
        animation: fadeInOut 2s ease-in-out infinite;
        border-radius: 8px;
    }
    
    @keyframes fadeInOut {
        0%, 100% { background-color: #f0f0f0; }
        50% { background-color: #e8e8e8; }
    }
    
    .skeleton-container {
        padding: 40px 0;
        min-height: 70vh;
    }
    
    .skeleton-image-main {
        width: 100%;
        height: 400px;
        margin-bottom: 30px;
        border-radius: 12px;
    }
    
    .skeleton-line-short { width: 30%; height: 20px; margin-bottom: 10px; }
    .skeleton-line-medium { width: 60%; height: 20px; margin-bottom: 10px; }
    .skeleton-line-full { width: 100%; height: 20px; margin-bottom: 10px; }
    .skeleton-line-long { width: 80%; height: 20px; margin-bottom: 10px; }
    
    .skeleton-sidebar-title { width: 80%; height: 30px; margin-bottom: 20px; background-color: #f0f0f0; border-radius: 8px; }
    .skeleton-post-image { width: 70px; height: 67px; background-color: #f0f0f0; border-radius: 8px; }
    .skeleton-sidebar-post { display: flex; gap: 15px; margin-bottom: 20px; }
    .skeleton-post-content { flex: 1; }
    
    /* News details styles */
    .news-details {
        padding: 40px 0;
    }
    
    .news-details__img {
        position: relative;
        margin-bottom: 30px;
    }
    
    .news-details__img img {
        width: 100%;
        height: auto;
        border-radius: 8px;
        cursor: pointer;
    }
    
    .news-details__date {
        position: absolute;
        bottom: 20px;
        left: 20px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
    }
    
    .news-details__meta {
        display: flex;
        gap: 20px;
        margin-bottom: 20px;
    }
    
    .news-details__meta li a {
        color: #666;
        text-decoration: none;
    }
    
    .news-details__title {
        font-size: 2.5rem;
        margin-bottom: 20px;
        color: #333;
    }
    
    .news-details__text-1 {
        font-size: 1.1rem;
        line-height: 1.8;
        color: #555;
        margin-bottom: 30px;
    }
    
    .news-details__social-list {
        display: flex;
        gap: 15px;
    }
    
    .news-details__social-list a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: #f8f9fa;
        border-radius: 50%;
        color: #333;
        text-decoration: none;
        transition: all 0.3s ease;
    }
    
    .news-details__social-list a:hover {
        background: #007bff;
        color: white;
    }
</style>

<div class="banner" id="banner">
    <div class="banner-loading" id="banner-loading">
        <div class="spinner"></div>
    </div>
    <div class="banner-content" id="banner-content" style="display: none;">
        <h1 id="noticia-titulo-banner">¡Noticias!</h1>
        <p id="noticia-descripcion-banner">Mantente informado</p>
    </div>
</div>

<main id="main-content">
    <!-- Skeleton loader -->
    <div id="skeleton-loader" class="skeleton-container">
        <div class="container">
            <div class="row">
                <div class="col-xl-8 col-lg-7">
                    <div class="skeleton-main-content">
                        <div class="skeleton-image-main"></div>
                        <div class="skeleton-meta">
                            <div class="skeleton-line skeleton-line-short"></div>
                            <div class="skeleton-line skeleton-line-medium"></div>
                        </div>
                        <div class="skeleton-title">
                            <div class="skeleton-line skeleton-line-full"></div>
                            <div class="skeleton-line skeleton-line-medium"></div>
                        </div>
                        <div class="skeleton-content">
                            <div class="skeleton-line skeleton-line-full"></div>
                            <div class="skeleton-line skeleton-line-full"></div>
                            <div class="skeleton-line skeleton-line-long"></div>
                            <div class="skeleton-line skeleton-line-full"></div>
                            <div class="skeleton-line skeleton-line-medium"></div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-4 col-lg-5">
                    <div class="skeleton-sidebar">
                        <div class="skeleton-sidebar-title"></div>
                        <div class="skeleton-sidebar-post">
                            <div class="skeleton-post-image"></div>
                            <div class="skeleton-post-content">
                                <div class="skeleton-line skeleton-line-short"></div>
                                <div class="skeleton-line skeleton-line-medium"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- News content template -->
    <section id="news-content" class="news-details" style="display: none;">
        <div class="container">
            <div class="row">
                <div class="col-xl-8 col-lg-7">
                    <div class="news-details__left">
                        <div class="news-details__img">
                            <img id="noticia-imagen" src="" alt="" onclick="abrirModalImagen(this.src, this.alt)">
                            <div class="news-details__date">
                                <p id="noticia-fecha-corta"></p>
                            </div>
                        </div>
                        <div class="news-details__content">
                            <ul class="list-unstyled news-details__meta">
                                <li><a><i class="fas fa-tag"></i><span id="noticia-departamento"></span></a></li>
                                <li><a><i class="fas fa-calendar"></i><span id="noticia-fecha"></span></a></li>
                            </ul>
                            <h3 class="news-details__title" id="noticia-titulo"></h3>
                            <div class="news-details__text-1" id="noticia-contenido"></div>
                        </div>
                        <div class="news-details__bottom" style="justify-content: end;">
                            <div class="news-details__social-list">
                                <a href="https://twitter.com/SENAComunica"><i class="fab fa-twitter"></i></a>
                                <a href="https://www.facebook.com/SENA/"><i class="fab fa-facebook"></i></a>
                                <a href="https://www.tiktok.com/@senacomunica_"><i class="fab fa-tiktok"></i></a>
                                <a href="https://www.instagram.com/senacomunica/"><i class="fab fa-instagram"></i></a>
                                <a href="https://wa.me/573112545028" target="_blank"><i class="fab fa-whatsapp"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-4 col-lg-5">
                    <div class="sidebar">
                        <div id="ultimas-publicaciones">
                            <!-- Últimas publicaciones se cargarán aquí -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>

<script>
console.log('detalle_noticia.php component loaded');
console.log('ID from PHP:', '<?php echo $id_noticia; ?>');

// Utility functions
function formatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}-${mes}-${año}`;
}

function formatoFechaCorta(fechaString) {
    try {
        const fecha = new Date(fechaString);
        const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const dia = fecha.getDate();
        const mes = meses[fecha.getMonth()];
        const año = fecha.getFullYear();
        return `${dia} ${mes} ${año}`;
    } catch (error) {
        return 'Fecha no válida';
    }
}

function formatearContenido(contenido) {
    if (!contenido) return 'Sin contenido disponible';
    const lineas = contenido.split(/\r?\n/).filter(linea => linea.trim() !== '');
    const parrafos = lineas.map(linea => `<p>${linea.trim()}</p>`).join('');
    return parrafos || '<p>Sin contenido disponible</p>';
}

function getImagenPrincipal(noticia) {
    if (noticia.imagen) {
        try {
            const arr = JSON.parse(noticia.imagen);
            if (arr[0]?.name) return `./assets/images/placeholder.jpg`; // Placeholder por ahora
        } catch (e) {
            return `./assets/images/placeholder.jpg`;
        }
    }
    return './assets/images/placeholder.jpg';
}

document.addEventListener('DOMContentLoaded', function() {
    const noticiaId = '<?php echo $id_noticia; ?>';
    
    if (noticiaId) {
        // Cargar datos de la noticia
        Promise.all([
            fetch('assets/components/backend/getDetalleNoticia.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: parseInt(noticiaId) })
            }),
            fetch('assets/components/backend/getNoticias.php', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
        ])
        .then(([responseDetalle, responseUltimas]) => {
            return Promise.all([responseDetalle.json(), responseUltimas.json()]);
        })
        .then(([dataDetalle, dataUltimas]) => {
            if (dataDetalle.success && dataDetalle.noticia) {
                const noticia = dataDetalle.noticia;
                
                // Llenar los datos en el template
                document.getElementById('noticia-imagen').src = getImagenPrincipal(noticia);
                document.getElementById('noticia-imagen').alt = noticia.titulo;
                document.getElementById('noticia-fecha-corta').textContent = formatoFechaCorta(noticia.fecha_publicacion);
                document.getElementById('noticia-departamento').textContent = noticia.departamento || 'General';
                document.getElementById('noticia-fecha').textContent = formatearFecha(noticia.fecha_publicacion);
                document.getElementById('noticia-titulo').textContent = noticia.titulo;
                document.getElementById('noticia-contenido').innerHTML = formatearContenido(noticia.contenido);
                
                // Cargar últimas publicaciones
                if (dataUltimas.success && dataUltimas.noticias) {
                    const ultimasNoticias = dataUltimas.noticias.slice(0, 5);
                    const ultimasHTML = `
                        <div class="sidebar__single sidebar__post">
                            <h3 class="sidebar__title">Últimas Publicaciones</h3>
                            <ul class="sidebar__post-list list-unstyled">
                                ${ultimasNoticias.map(noticia => `
                                    <li>
                                        <div class="sidebar__post-image" style="width: 135px !important; height: 67px; overflow: hidden;">
                                            <img src="${getImagenPrincipal(noticia)}" alt="${noticia.titulo}" style="width: 100%; height: 100%; object-fit: cover;">
                                        </div>
                                        <div class="sidebar__post-content">
                                            <h3>
                                                <a href="detalle_noticia.php?id=${noticia.id}">${noticia.titulo.substring(0, 38)}...</a>
                                            </h3>
                                        </div>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    `;
                    document.getElementById('ultimas-publicaciones').innerHTML = ultimasHTML;
                }
                
                // Ocultar skeleton y mostrar contenido
                document.getElementById('skeleton-loader').style.display = 'none';
                document.getElementById('news-content').style.display = 'block';
                
            } else {
                document.getElementById('skeleton-loader').innerHTML = '<div class="alert alert-danger">Error: No se encontró la noticia</div>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('skeleton-loader').innerHTML = '<div class="alert alert-danger">Error al cargar la noticia</div>';
        });
    }
});
</script>