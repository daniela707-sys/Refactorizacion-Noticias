// =============================================================================
// MODAL DE IMAGEN
// =============================================================================
function abrirModalImagen(urlImagen, altText) {
    // Crear modal si no existe
    let modal = document.getElementById('modal-imagen');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-imagen';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div style="position: relative; width: 400px; height: auto; text-align: center;">
                <img id="modal-imagen-content" style="width: 100%; height: auto; object-fit: contain; border-radius: 8px;">
                <button id="cerrar-modal" style="
                    position: absolute;
                    top: -15px;
                    right: -15px;
                    background: white;
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    font-size: 20px;
                    cursor: pointer;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">&times;</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners
        modal.addEventListener('click', cerrarModalImagen);
        document.getElementById('cerrar-modal').addEventListener('click', cerrarModalImagen);
        
        // Prevenir que el clic en la imagen cierre el modal
        document.getElementById('modal-imagen-content').addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Configurar imagen y mostrar modal
    const modalImg = document.getElementById('modal-imagen-content');
    modalImg.src = urlImagen;
    modalImg.alt = altText;
    
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
}

function cerrarModalImagen() {
    const modal = document.getElementById('modal-imagen');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
    
    // Restaurar scroll del body
    document.body.style.overflow = 'auto';
}

// Cerrar modal con tecla Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        cerrarModalImagen();
    }
});

// =============================================================================
// SKELETON LOADING COMPONENTS
// =============================================================================
function createSkeletonLoader() {
    return `
        <div class="skeleton-container">
            <div class="container">
                <div class="row">
                    <div class="col-xl-8 col-lg-7">
                        <div class="skeleton-main-content">
                            <!-- Skeleton imagen principal -->
                            <div class="skeleton-image-main"></div>
                            
                            <!-- Skeleton meta información -->
                            <div class="skeleton-meta">
                                <div class="skeleton-line skeleton-line-short"></div>
                                <div class="skeleton-line skeleton-line-medium"></div>
                            </div>
                            
                            <!-- Skeleton título -->
                            <div class="skeleton-title">
                                <div class="skeleton-line skeleton-line-full"></div>
                                <div class="skeleton-line skeleton-line-medium"></div>
                            </div>
                            
                            <!-- Skeleton contenido -->
                            <div class="skeleton-content">
                                <div class="skeleton-line skeleton-line-full"></div>
                                <div class="skeleton-line skeleton-line-full"></div>
                                <div class="skeleton-line skeleton-line-long"></div>
                                <div class="skeleton-line skeleton-line-full"></div>
                                <div class="skeleton-line skeleton-line-medium"></div>
                                <div class="skeleton-line skeleton-line-full"></div>
                                <div class="skeleton-line skeleton-line-short"></div>
                            </div>
                            
                            <!-- Skeleton social buttons -->
                            <div class="skeleton-social">
                                <div class="skeleton-circle"></div>
                                <div class="skeleton-circle"></div>
                                <div class="skeleton-circle"></div>
                                <div class="skeleton-circle"></div>
                                <div class="skeleton-circle"></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-4 col-lg-5">
                        <div class="skeleton-sidebar">
                            <!-- Skeleton título sidebar -->
                            <div class="skeleton-sidebar-title"></div>
                            
                            <!-- Skeleton posts laterales -->
                            <div class="skeleton-sidebar-post">
                                <div class="skeleton-post-image"></div>
                                <div class="skeleton-post-content">
                                    <div class="skeleton-line skeleton-line-short"></div>
                                    <div class="skeleton-line skeleton-line-medium"></div>
                                </div>
                            </div>
                            
                            <div class="skeleton-sidebar-post">
                                <div class="skeleton-post-image"></div>
                                <div class="skeleton-post-content">
                                    <div class="skeleton-line skeleton-line-short"></div>
                                    <div class="skeleton-line skeleton-line-medium"></div>
                                </div>
                            </div>
                            
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
    `;
}

// =============================================================================
// FUNCIONES UTILITARIAS
// =============================================================================
function ensureRedemprendedoresPath(path) {
    let nombre_imagen = path.replace(/.*files\//, '');
    return `/redemprendedores/files/${nombre_imagen}`;
}

function ensurelocalredemprendedores(localPath) {
    let nombre_imagen = localPath.replace(/.*files\//, '');
    return `/redemprendedores/output/files/${nombre_imagen}`;
}

function convertLocalPathToUrl(localPath) {
    if (!localPath) return './assets/images/placeholder.jpg';
    const baseUrl = window.location.origin;
    if (baseUrl.includes('localhost')) {
        return ensurelocalredemprendedores(localPath);
    } else {
        return ensureRedemprendedoresPath(localPath);
    }
}

function formatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}-${mes}-${año}`;
}

// Nueva función para formato de fecha corta
function formatoFechaCorta(fechaString) {
    try {
        // Normalizar la fecha
        let fechaNormalizada = fechaString;
        if (fechaString.includes(' ')) {
            fechaNormalizada = fechaString.replace(' ', 'T');
        }
        
        const fecha = new Date(fechaNormalizada);
        
        // Verificar que la fecha es válida
        if (isNaN(fecha.getTime())) {
            console.warn('Fecha inválida:', fechaString);
            return 'Fecha no válida';
        }
        
        const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        
        const dia = fecha.getDate();
        const mes = meses[fecha.getMonth()];
        const año = fecha.getFullYear();
        
        return `${dia} ${mes} ${año}`;
    } catch (error) {
        console.error('Error al formatear fecha:', error);
        return 'Fecha no válida';
    }
}

function limitarTexto(texto, maxLength) {
    return texto.length > maxLength ? texto.substring(0, maxLength) + '...' : texto;
}

// =============================================================================
// FUNCIÓN PARA FORMATEAR CONTENIDO CON PÁRRAFOS
// =============================================================================
function formatearContenido(contenido) {
    if (!contenido) return 'Sin contenido disponible';
    
    // Dividir por saltos de línea y filtrar líneas vacías
    const lineas = contenido.split(/\r?\n/).filter(linea => linea.trim() !== '');
    
    // Convertir cada línea en un párrafo
    const parrafos = lineas.map(linea => `<p>${linea.trim()}</p>`).join('');
    
    return parrafos || '<p>Sin contenido disponible</p>';
}

// =============================================================================
// FUNCIONES PARA ÚLTIMAS PUBLICACIONES DINÁMICAS
// =============================================================================

// Función para crear skeleton de últimas publicaciones
function createSkeletonUltimasPublicaciones() {
    return `
        <div class="sidebar__single sidebar__post">
            <div class="skeleton-sidebar-title"></div>
            <ul class="sidebar__post-list list-unstyled">
                <li class="skeleton-sidebar-post">
                    <div class="skeleton-post-image"></div>
                    <div class="skeleton-post-content">
                        <div class="skeleton-line skeleton-line-short"></div>
                        <div class="skeleton-line skeleton-line-medium"></div>
                    </div>
                </li>
                <li class="skeleton-sidebar-post">
                    <div class="skeleton-post-image"></div>
                    <div class="skeleton-post-content">
                        <div class="skeleton-line skeleton-line-short"></div>
                        <div class="skeleton-line skeleton-line-medium"></div>
                    </div>
                </li>
                <li class="skeleton-sidebar-post">
                    <div class="skeleton-post-image"></div>
                    <div class="skeleton-post-content">
                        <div class="skeleton-line skeleton-line-short"></div>
                        <div class="skeleton-line skeleton-line-medium"></div>
                    </div>
                </li>
            </ul>
        </div>
    `;
}

// Función para cargar las últimas publicaciones dinámicamente
function cargarUltimasPublicaciones() {
    return fetch('assets/components/backend/getNoticias.php', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success && data.noticias) {
            const ultimasNoticias = data.noticias.slice(0, 5);
            return generarHTMLUltimasPublicaciones(ultimasNoticias);
        } else {
            throw new Error(data.error || 'No se encontraron noticias');
        }
    })
    .catch(error => {
        console.error('Error al cargar últimas publicaciones:', error);
        return generarHTMLPublicacionesDefault();
    });
}

// Función para generar el HTML de las últimas publicaciones
function generarHTMLUltimasPublicaciones(noticias) {
    const listItems = noticias.map(noticia => {
        const imagen = getImagenPrincipal(noticia);
        const titulo = limitarTexto(noticia.titulo, 38);
        
        return `
            <li>
                <div class="sidebar__post-image" style="width: 135px !important; height: 67px; overflow: hidden;">
                    <img src="${imagen}" alt="${noticia.titulo}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="sidebar__post-content">
                    <h3>
                        <a href="detalle_noticia.php?id=${noticia.id}">${titulo}</a>
                    </h3>
                </div>
            </li>
        `;
    }).join('');

    return `
        <div class="sidebar__single sidebar__post">
            <h3 class="sidebar__title">Últimas Publicaciones</h3>
            <ul class="sidebar__post-list list-unstyled">
                ${listItems}
            </ul>
        </div>
    `;
}

// Función fallback para cuando no se pueden cargar las noticias
function generarHTMLPublicacionesDefault() {
    return `
        <div class="sidebar__single sidebar__post">
            <h3 class="sidebar__title">Últimas Publicaciones</h3>
            <ul class="sidebar__post-list list-unstyled">
                <li>
                    <div class="sidebar__post-image" style="width: 70px; height: 67px; overflow: hidden;">
                        <img src="assets/images/blog/lp-1-1.jpg" alt="" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="sidebar__post-content">
                        <h3>
                            <span class="sidebar__post-content-meta"><i class="fas fa-comments"></i>02</span>
                            <a href="news-details.html">Agriculture miracle you dont know about</a>
                        </h3>
                    </div>
                </li>
                <li>
                    <div class="sidebar__post-image" style="width: 70px; height: 67px; overflow: hidden;">
                        <img src="assets/images/blog/lp-1-2.jpg" alt="" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="sidebar__post-content">
                        <h3>
                            <span class="sidebar__post-content-meta"><i class="fas fa-comments"></i>02</span>
                            <a href="news-details.html">There are many variations of passage</a>
                        </h3>
                    </div>
                </li>
                <li>
                    <div class="sidebar__post-image" style="width: 70px; height: 67px; overflow: hidden;">
                        <img src="assets/images/blog/lp-1-3.jpg" alt="" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="sidebar__post-content">
                        <h3>
                            <span class="sidebar__post-content-meta"><i class="fas fa-comments"></i>02</span>
                            <a href="news-details.html">Bring to the table win-win survival</a>
                        </h3>
                    </div>
                </li>
            </ul>
        </div>
    `;
}

// =============================================================================
// FUNCIÓN PRINCIPAL PARA CARGAR BANNER
// =============================================================================
function cargarBannerPrincipal(noticia) {
    const bannerContainer = document.getElementById('banner');
    if (!bannerContainer) return;

    fetch('assets/components/backend/getBannerNoticia.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ubicacion: 'NOTICIAS' })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(text => {
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('Error al parsear JSON del banner:', e);
            console.error('Respuesta recibida:', text);
            throw new Error('Respuesta del servidor no es JSON válido');
        }
        
        if (data.success && data.fotos?.length > 0) {
            try {
                const fotoData = data.fotos[0].foto;
                const jsonArray = JSON.parse(fotoData);
                
                if (Array.isArray(jsonArray) && jsonArray[0]?.name) {
                    const imagenUrl = convertLocalPathToUrl(jsonArray[0].name);
                    createSingleImageBanner(imagenUrl);
                    return;
                }
            } catch (e) {
                console.error("Error al parsear imagen del banner:", e);
            }
        }
        cargarBannerFallback();
    })
    .catch(error => {
        console.error('Error al cargar banner:', error);
        cargarBannerFallback();
    });
}

// =============================================================================
// FUNCIÓN PARA CARGAR BANNER CON IMAGEN DE LA NOTICIA (FALLBACK)
// =============================================================================
function cargarBannerConImagenNoticia(noticia) {
    let imagenUrl = null;
    
    if (noticia.imagen) {
        try {
            const arr = JSON.parse(noticia.imagen);
            if (arr[0]?.name) imagenUrl = convertLocalPathToUrl(arr[0].name);
        } catch (e) {
            imagenUrl = convertLocalPathToUrl(noticia.imagen);
        }
    }

    if (imagenUrl) {
        createSingleImageBanner(imagenUrl);
    } else {
        cargarBannerFallback();
    }
}

// =============================================================================
// FUNCIÓN DE FALLBACK FINAL
// =============================================================================
function cargarBannerFallback() {
    const banner = document.getElementById('banner');
    if (!banner) return;
    
    const imagenFallback = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1600&q=80';
    
    banner.style.backgroundImage = `url('${imagenFallback}')`;
    banner.style.backgroundSize = 'cover';
    banner.style.backgroundPosition = 'center';
    banner.style.backgroundRepeat = 'no-repeat';
    banner.style.minHeight = '400px';
    banner.style.display = 'flex';
    banner.style.alignItems = 'center';
    banner.style.justifyContent = 'center';
    
    const bannerLoading = document.getElementById('banner-loading');
    const bannerContent = document.getElementById('banner-content');
    
    setTimeout(() => {
        if (bannerLoading) bannerLoading.style.display = 'none';
        if (bannerContent) {
            bannerContent.style.display = 'block';
            bannerContent.style.opacity = '1';
            bannerContent.style.zIndex = '10';
            bannerContent.style.position = 'relative';
            bannerContent.classList.add('fade-in');
        }
    }, 800);

    if (window.bannerRotationInterval) {
        clearInterval(window.bannerRotationInterval);
    }
}

function createSingleImageBanner(imageUrl) {
    const banner = document.getElementById('banner');
    const dotsContainer = document.getElementById('dots');
    const bannerLoading = document.getElementById('banner-loading');
    const bannerContent = document.getElementById('banner-content');

    if (dotsContainer) dotsContainer.innerHTML = '';
    banner.style.backgroundImage = `url(${imageUrl})`;
    banner.style.backgroundSize = 'cover';
    banner.style.backgroundPosition = 'center';

    setTimeout(() => {
        if (bannerLoading) bannerLoading.style.display = 'none';
        if (bannerContent) {
            bannerContent.style.display = 'block';
            bannerContent.classList.add('fade-in');
        }
    }, 800);

    if (window.bannerRotationInterval) {
        clearInterval(window.bannerRotationInterval);
    }
}

// =============================================================================
// CARGA DE DATOS DE LA NOTICIA - FUNCIÓN PRINCIPAL MODIFICADA
// =============================================================================
// Mover la declaración de parámetros aquí para evitar duplicados
const urlParams = new URLSearchParams(window.location.search);
const noticiaId = urlParams.get("id");

function cargarDetallesNoticia() {
    // Verificar que mainContent existe
    const mainContent = document.getElementById('main-content') || document.querySelector('.main-content') || document.querySelector('main');
    
    if (!mainContent) {
        console.error('Elemento mainContent no encontrado');
        return;
    }
    
    if (!noticiaId) {
        mainContent.innerHTML = '<div class="error-message">ID de noticia no válido</div>';
        return;
    }

    // Mostrar skeleton loader inmediatamente
    mainContent.innerHTML = createSkeletonLoader();

    // Cargar detalles de la noticia y últimas publicaciones en paralelo
    Promise.all([
        fetch('assets/components/backend/getDetalleNoticia.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: parseInt(noticiaId) })
        }),
        cargarUltimasPublicaciones()
    ])
    .then(([responseDetalle, htmlUltimasPublicaciones]) => {
        if (!responseDetalle.ok) {
            throw new Error(`HTTP error! status: ${responseDetalle.status}`);
        }
        return Promise.all([responseDetalle.text(), htmlUltimasPublicaciones]);
    })
    .then(([textDetalle, htmlUltimasPublicaciones]) => {        
        // Intentar parsear como JSON
        let data;
        try {
            data = JSON.parse(textDetalle);
        } catch (e) {
            console.error('Error al parsear JSON:', e);
            console.error('Respuesta recibida:', textDetalle);
            throw new Error('Respuesta del servidor no es JSON válido');
        }
        
        if (data.success && data.noticia) {
            const noticia = data.noticia;
            
            // Configurar banner de manera segura
            try {
                cargarBannerPrincipal();
            } catch (e) {
                console.warn('Error al cargar banner:', e);
            }

            // Actualizar banner de manera segura
            const bannerTitle = document.getElementById('noticia-titulo-banner');
            const bannerDescription = document.getElementById('noticia-descripcion-banner');

            if (bannerTitle && noticia.titulo) {
                bannerTitle.textContent = limitarTexto(noticia.titulo, 60);
            }

            if (bannerDescription && noticia.fecha_publicacion) {
                bannerDescription.textContent = `Publicado el ${formatearFecha(noticia.fecha_publicacion)}`;
            }

            // Usar la nueva función para formatear fecha corta
            const fechaFormateada = formatoFechaCorta(noticia.fecha_publicacion);
            const imgFoto = convertLocalPathToUrl(noticia.imagen);

            // Crear estructura con últimas publicaciones dinámicas
            const noticiaStructure = document.createElement('section');
            noticiaStructure.className = 'news-details';
            noticiaStructure.innerHTML = `
                <div class="container">
                    <div class="row">
                        <div class="col-xl-8 col-lg-7">
                            <div class="news-details__left">
                                <div class="news-details__img">
                                    <img src="${imgFoto ? getImagenPrincipal(noticia) : 'assets/images/blog/news-details-img-1.jpg'}" alt="${noticia.titulo || ''}" onclick="abrirModalImagen('${getImagenPrincipal(noticia)}', '${noticia.titulo}')">
                                    <div class="news-details__date">
                                        <p>${fechaFormateada}</p>
                                    </div>
                                </div>
                                <div class="news-details__content">
                                    <ul class="list-unstyled news-details__meta">
                                        <li><a><i class="fas fa-tag"></i>${noticia.departamento || 'General'}</a></li>
                                        <li><a><i class="fas fa-calendar"></i>${formatearFecha(noticia.fecha_publicacion)}</a></li>
                                    </ul>
                                    <h3 class="news-details__title">${noticia.titulo}</h3>
                                    <p class="news-details__text-1">${formatearContenido(noticia.contenido)}</p>
                                    <p class="news-details__text-2"></p>
                                </div>
                                <div class="news-details__bottom" style="justify-content: end;">
                                    <div class="news-details__social-list">
                                        <a href="https://twitter.com/SENAComunica"><i class="fab fa-twitter"></i></a>
                                        <a href="https://www.facebook.com/SENA/"><i class="fab fa-facebook"></i></a>
                                        <a href="https://www.tiktok.com/@senacomunica_"><i class="fab fa-tiktok"></i></a>
                                        <a href="https://www.instagram.com/senacomunica/"><i class="fab fa-instagram"></i></a>
                                        <a href="https://wa.me/573112545028" target="_blank"><i class="fab fa-whatsapp" aria-hidden="true"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-4 col-lg-5">
                            <div class="sidebar">
                                ${htmlUltimasPublicaciones}
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Reemplazar skeleton con contenido real con animación suave
            setTimeout(() => {
                mainContent.innerHTML = '';
                mainContent.appendChild(noticiaStructure);
                noticiaStructure.style.opacity = '0';
                noticiaStructure.style.transform = 'translateY(20px)';
                noticiaStructure.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                
                setTimeout(() => {
                    noticiaStructure.style.opacity = '1';
                    noticiaStructure.style.transform = 'translateY(0)';
                }, 50);
            }, 100);

        } else {
            throw new Error(data.error || 'No se encontraron datos de la noticia');
        }
    })
    .catch(error => {
        console.error('Error al cargar los datos de la noticia:', error);
        
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="error-message slide-up">
                    <h3>Lo sentimos</h3>
                    <p>Hubo un problema al cargar los datos de la noticia. Por favor intente nuevamente más tarde.</p>
                    <button onclick="location.reload()">Intentar de nuevo</button>
                </div>
            `;
        }
        
        try {
            cargarBannerFallback();
        } catch (e) {
            console.warn('Error al cargar banner fallback:', e);
        }
    });
}

function getImagenPrincipal(noticia) {
    if (noticia.imagen) {
        try {
            const arr = JSON.parse(noticia.imagen);
            if (arr[0]?.name) return convertLocalPathToUrl(arr[0].name);
        } catch (e) {
            return convertLocalPathToUrl(noticia.imagen);
        }
    }
    return './assets/images/placeholder.jpg';
}

// =============================================================================
// CARRUSEL DE NOTICIAS RELACIONADAS
// =============================================================================
function cargarNoticiasRelacionadas(noticiaActual) {
    const noticiasSection = document.createElement('div');
    noticiasSection.className = 'noticias-container blog-news-carousel';
    noticiasSection.innerHTML = `
        <div class="blog-news-title">
            <h3>Noticias relacionadas</h3>
            <div class="blog-news-header-right">
                <div class="blog-news-navigation">
                    <div class="blog-news-nav-btn prev" id="related-news-prev">‹</div>
                    <div class="blog-news-nav-btn next" id="related-news-next">›</div>
                </div>
            </div>
        </div>
        <div class="blog-news-track" id="related-news-carousel">
            <div class="loading-indicator">
                <p>Cargando noticias...</p>
            </div>
        </div>
    `;

    const contentContainer = document.querySelector('.noticia-container');
    if (contentContainer && contentContainer.parentNode) {
        contentContainer.parentNode.insertBefore(noticiasSection, contentContainer.nextSibling);
    }

    setTimeout(() => {
        fetch('assets/components/backend/getNoticias.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                limite: 6,
                pagina: 0,
                orden: 'fecha_publicacion',
                direccion: 'DESC'
            })
        })
        .then(response => response.json())
        .then(data => {
            const cardsContainer = document.getElementById('related-news-carousel');
            cardsContainer.innerHTML = '';

            if (data.success && data.noticias?.length > 0) {
                // Filtrar la noticia actual
                const noticiasRelacionadas = data.noticias.filter(noticia => noticia.id !== parseInt(noticiaActual.id));

                noticiasRelacionadas.forEach((noticia, index) => {
                    setTimeout(() => {
                        const article = document.createElement('article');
                        article.classList.add('blog-news-card');
                        
                        let imagenUrl = './assets/images/placeholder.jpg';
                        if (noticia.imagen) {
                            try {
                                const arr = JSON.parse(noticia.imagen);
                                if (arr[0]?.name) imagenUrl = convertLocalPathToUrl(arr[0].name);
                            } catch (e) {
                                imagenUrl = convertLocalPathToUrl(noticia.imagen);
                            }
                        }

                        const contenidoPreview = noticia.contenido 
                            ? noticia.contenido.substring(0, 120) + '...' 
                            : 'Sin descripción disponible';

                        article.innerHTML = `
                            <div class="blog-news-image">
                                <img src="${imagenUrl}" alt="${noticia.titulo}">
                                <span class="blog-news-category">${(noticia.nombre_categoria || 'GENERAL').toUpperCase()}</span>
                            </div>
                            <div class="blog-news-content">
                                <div class="blog-news-meta">
                                    <span>${noticia.autor || 'Admin'}</span>
                                    <span>•</span>
                                    <span>${formatearFecha(noticia.fecha_publicacion)}</span>
                                </div>
                                <h4 class="blog-news-title-text">${noticia.titulo}</h4>
                                <p class="blog-news-excerpt">${contenidoPreview}</p>
                            </div>
                        `;

                        article.addEventListener('click', () => {
                            window.location.href = `detalle_noticia.php?id=${noticia.id}`;
                        });

                        cardsContainer.appendChild(article);
                    }, index * 100);
                });

                setTimeout(() => {
                    createRelatedNewsCarousel();
                }, noticiasRelacionadas.length * 100 + 200);
            } else {
                cardsContainer.innerHTML = '<div class="no-events">No se encontraron noticias relacionadas</div>';
            }
        })
        .catch(error => {
            console.error('Error al cargar noticias relacionadas:', error);
            document.getElementById('related-news-carousel').innerHTML = 
                '<div class="error-message">No se pudieron cargar las noticias relacionadas</div>';
        });
    }, 1000);
}

function createRelatedNewsCarousel() {
    const cardsContainer = document.getElementById('related-news-carousel');
    const prevButton = document.getElementById('related-news-prev');
    const nextButton = document.getElementById('related-news-next');

    if (!cardsContainer || !prevButton || !nextButton) return;

    let currentIndex = 0;
    let autoScrollInterval;

    function getVisibleCardsCount() {
        const containerWidth = cardsContainer.clientWidth;
        if (containerWidth < 576) return 1;
        if (containerWidth < 768) return 2;
        if (containerWidth < 992) return 3;
        return 4;
    }

    const totalCards = cardsContainer.querySelectorAll('.blog-news-card').length;

    function scrollToIndex(index) {
        const cardElement = cardsContainer.querySelector('.blog-news-card');
        if (!cardElement) return;
        
        const cardWidth = cardElement.offsetWidth;
        const gap = 20;
        const maxIndex = Math.max(0, totalCards - getVisibleCardsCount());
        
        if (index > maxIndex) index = 0;
        if (index < 0) index = maxIndex;
        currentIndex = index;
        
        const scrollLeftValue = index * (cardWidth + gap);
        
        cardsContainer.scrollTo({
            left: scrollLeftValue,
            behavior: 'smooth'
        });
    }

    function autoScroll() {
        scrollToIndex(currentIndex + 1);
    }

    function startAutoScroll() {
        clearInterval(autoScrollInterval);
        autoScrollInterval = setInterval(autoScroll, 4000);
    }

    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }

    startAutoScroll();

    nextButton.addEventListener('click', function() {
        stopAutoScroll();
        scrollToIndex(currentIndex + 1);
        startAutoScroll();
    });

    prevButton.addEventListener('click', function() {
        stopAutoScroll();
        scrollToIndex(currentIndex - 1);
        startAutoScroll();
    });

    cardsContainer.addEventListener('mouseenter', stopAutoScroll);
    cardsContainer.addEventListener('mouseleave', startAutoScroll);

    window.addEventListener('resize', function() {
        scrollToIndex(currentIndex);
    });
}

// =============================================================================
// INICIALIZACIÓN PRINCIPAL
// =============================================================================
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        cargarDetallesNoticia();
    }, 500);
});