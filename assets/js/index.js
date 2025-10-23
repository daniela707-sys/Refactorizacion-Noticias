document.addEventListener('DOMContentLoaded', function () {
    // Variables globales
    let departamentoToken = '';
    let departamentoFiltro = '';
    let categoriaFiltro = '';
    let busquedaFiltro = '';
    let fechaDesdeFiltro = '';
    let fechaHastaFiltro = '';
    let paginaActual = 0;

    // Inicializar
    departamentoToken = localStorage.getItem('departamento') || '';
    departamentoToken = normalizarTexto(departamentoToken);
    inicializarFiltros();

    // Funciones auxiliares
    function normalizarTexto(texto) {
        if (!texto) return '';
        return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    }

    function inicializarFiltros() {
        const urlParams = new URLSearchParams(window.location.search);
        const filtroURL = urlParams.get('departamento');
        const categoriaURL = urlParams.get('categoria');
        const busquedaURL = urlParams.get('buscar');
        const fechaDesdeURL = urlParams.get('fecha_desde');
        const fechaHastaURL = urlParams.get('fecha_hasta');

        departamentoFiltro = filtroURL ? normalizarTexto(filtroURL) : (departamentoToken || 'TODOS');
        categoriaFiltro = categoriaURL || '';
        busquedaFiltro = busquedaURL || '';
        fechaDesdeFiltro = fechaDesdeURL || '';
        fechaHastaFiltro = fechaHastaURL || '';

        // Establecer valores en campos - con verificación de existencia
        const campoBusqueda = document.getElementById('buscador');
        if (campoBusqueda && busquedaFiltro) {
            campoBusqueda.value = busquedaFiltro;
        }

        const fechaDesde = document.getElementById('fecha-desde');
        if (fechaDesde && fechaDesdeFiltro) {
            fechaDesde.value = fechaDesdeFiltro;
        }

        const fechaHasta = document.getElementById('fecha-hasta');
        if (fechaHasta && fechaHastaFiltro) {
            fechaHasta.value = fechaHastaFiltro;
        }

        // Inicializar el select con el departamento del token
        const nombreDepartamento = document.getElementById('nombre_departamento');
        if (nombreDepartamento) {
            if (!filtroURL && departamentoToken) {
                const departamentoOriginal = localStorage.getItem('departamento') || 'TODOS';
                nombreDepartamento.textContent = departamentoOriginal;
            } else if (filtroURL) {
                nombreDepartamento.textContent = filtroURL;
            } else {
                nombreDepartamento.textContent = 'TODOS';
            }
        }
    }

    function actualizarURL() {
        const url = new URL(window.location.href);

        if (departamentoFiltro === 'TODOS' || departamentoFiltro === normalizarTexto(departamentoToken)) {
            url.searchParams.delete('departamento');
        } else {
            const current = document.getElementById('nombre_departamento');
            if (current && current.textContent !== 'TODOS') {
                url.searchParams.set('departamento', current.textContent);
            }
        }

        if (categoriaFiltro) {
            url.searchParams.set('categoria', categoriaFiltro);
        } else {
            url.searchParams.delete('categoria');
        }

        if (busquedaFiltro) {
            url.searchParams.set('buscar', busquedaFiltro);
        } else {
            url.searchParams.delete('buscar');
        }

        if (fechaDesdeFiltro) {
            url.searchParams.set('fecha_desde', fechaDesdeFiltro);
        } else {
            url.searchParams.delete('fecha_desde');
        }

        if (fechaHastaFiltro) {
            url.searchParams.set('fecha_hasta', fechaHastaFiltro);
        } else {
            url.searchParams.delete('fecha_hasta');
        }

        if (paginaActual > 0) {
            url.searchParams.set('pagina', paginaActual);
        } else {
            url.searchParams.delete('pagina');
        }

        window.history.pushState({}, '', url);
    }

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
    // Cargar noticias principales
    function cargarNoticias() {
        const newsGrid = document.getElementById('events-close-to-you');
        if (!newsGrid) {
            console.error('No se encontró el contenedor de noticias');
            return;
        }

        newsGrid.className = 'blog-news-track';
        newsGrid.innerHTML = '<div class="">Cargando noticias...</div>';

        let departamentoParaEnviar = departamentoFiltro === 'TODOS' ? '' : departamentoFiltro;
        let categoriaParaEnviar = categoriaFiltro || '';
        let busquedaParaEnviar = busquedaFiltro || '';

        const requestBody = {
            limite: 6,
            pagina: paginaActual,
            orden: 'fecha_publicacion',
            direccion: 'DESC'
        };

        if (departamentoParaEnviar) requestBody.departamento = departamentoParaEnviar;
        if (categoriaParaEnviar) requestBody.categoria = categoriaParaEnviar;
        if (busquedaParaEnviar) requestBody.buscar = busquedaParaEnviar;
        if (fechaDesdeFiltro) requestBody.fecha_desde = fechaDesdeFiltro;
        if (fechaHastaFiltro) requestBody.fecha_hasta = fechaHastaFiltro;

        fetch('assets/components/backend/getNoticias.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(text => {
                try {
                    return JSON.parse(text);
                } catch (e) {
                    console.error('Respuesta no es JSON válido:', text);
                    throw new Error('Respuesta del servidor no es JSON válido');
                }
            })
            .then(data => {
                console.log('Datos recibidos:', data);
                newsGrid.innerHTML = '';

                if (data.success && data.noticias?.length > 0) {
                    data.noticias.forEach(noticia => {
                        const newsItem = document.createElement('div');
                        newsItem.classList.add('blog-news-card');

                        let imagenUrl = './assets/images/placeholder.jpg';
                        if (noticia.imagen) {
                            try {
                                const arr = JSON.parse(noticia.imagen);
                                if (arr[0]?.name) imagenUrl = convertLocalPathToUrl(arr[0].name);
                            } catch (e) {
                                imagenUrl = convertLocalPathToUrl(noticia.imagen);
                            }
                        }

                        const categoria = noticia.categoria || 'General';
                        const fechaFormateada = formatearFecha(noticia.fecha_publicacion);
                        const autorIniciales = getAutorIniciales(noticia.autor);

                        newsItem.innerHTML = `
                        <div class="blog-news-image">
                            <img src="${imagenUrl}" alt="${noticia.titulo || 'Noticia'}">
                            <div class="blog-news-category tech">${noticia.nombre_categoria}</div>
                        </div>
                        <div class="blog-news-content">
                            <h3 class="blog-news-title-text">${noticia.titulo || 'Sin título'}</h3>
                            <p class="blog-news-excerpt">${noticia.extracto || (noticia.contenido ? noticia.contenido.substring(0, 150) + '...' : 'Sin descripción')}</p>
                            <div class="blog-news-meta">
                                <div class="blog-news-author-avatar">${autorIniciales}</div>
                                <span>${noticia.autor || 'Admin'}</span>
                                <span>•</span>
                                <span>${fechaFormateada}</span>
                            </div>
                        </div>
                        <div class="blog-news-actions">
                        </div>
                    `;

                        newsItem.addEventListener('click', () => {
                            window.location.href = `detalle_noticia.php?id=${noticia.id}`;
                        });

                        newsGrid.appendChild(newsItem);
                    });

                    generarPaginacion(data.total, 6);
                    mostrarInformacionResultados(data.total);
                } else {
                    newsGrid.innerHTML = '<div class="no-events">No se encontraron noticias</div>';
                    const paginationContainer = document.querySelector('.shop-page__pagination');
                    if (paginationContainer) paginationContainer.innerHTML = '';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                newsGrid.innerHTML = '<div class="error-message">Error al cargar noticias</div>';
            });
    }

    function getAutorIniciales(autor) {
        if (!autor) return 'AD';
        return autor.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }

    // Cargar categorías de noticias
    function cargarCategorias() {
        const categoryContainer = document.getElementById('category-event-list');
        if (!categoryContainer) {
            console.error('No se encontró el contenedor de categorías');
            return;
        }

        categoryContainer.innerHTML = '<div class="loading-indicator">Cargando categorías...</div>';

        fetch('assets/components/backend/getCategoriasNoticia.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(text => {
                try {
                    return JSON.parse(text);
                } catch (e) {
                    console.error('Respuesta no es JSON válido:', text);
                    throw new Error('Respuesta del servidor no es JSON válido');
                }
            })
            .then(data => {
                console.log('Categorías recibidas:', data);
                categoryContainer.innerHTML = '';

                if (data.success && data.categorias?.length > 0) {
                    data.categorias.forEach(categoria => {
                        const listItem = document.createElement('li');
                        const categoryLink = document.createElement('a');
                        categoryLink.href = "#";
                        categoryLink.classList.add('category-link');
                        // CAMBIO: usar 'id' en lugar de 'id_categoria'
                        categoryLink.setAttribute('data-value', categoria.id);

                        // CAMBIO: usar 'nombre' en lugar de 'nombre_categoria'
                        let categoryName = categoria.nombre || 'Categoría';
                        if (typeof categoryName === 'string') {
                            categoryName = categoryName.split(' ').map(word =>
                                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                            ).join(' ');
                        }

                        categoryLink.textContent = categoryName;

                        // CAMBIO: comparar con categoria.id
                        if (categoriaFiltro === categoria.id) {
                            categoryLink.classList.add('active');
                        }

                        categoryLink.addEventListener('click', function (event) {
                            event.preventDefault();

                            document.querySelectorAll('.category-link').forEach(link =>
                                link.classList.remove('active')
                            );

                            // CAMBIO: comparar con categoria.id
                            if (categoriaFiltro === categoria.id) {
                                categoriaFiltro = '';
                            } else {
                                this.classList.add('active');
                                categoriaFiltro = categoria.id;
                            }

                            actualizarURL();
                            cargarNoticias();
                        });

                        listItem.appendChild(categoryLink);
                        categoryContainer.appendChild(listItem);
                    });
                } else {
                    categoryContainer.innerHTML = '<div class="no-categories">No se encontraron categorías</div>';
                }
            })
            .catch(error => {
                console.error('Error al cargar categorías:', error);
                categoryContainer.innerHTML = '<div class="error-message">Error al cargar categorías</div>';
            });
    }

    // FUNCIÓN CARGAR DEPARTAMENTOS - INDEPENDIENTE
    function cargarDepartamentos() {
        const departamentoContainer = document.querySelector('.shop-best-sellers.product__sidebar-single');
        if (!departamentoContainer) return;

        const current = document.getElementById('nombre_departamento');
        const list = document.getElementById('departamento-list');
        
        // Verificar que los elementos existan antes de continuar
        if (!current || !list) {
            console.warn('Elementos de departamento no encontrados en el DOM');
            return;
        }

        // Mostrar el departamento del TOKEN como valor por defecto
        const departamentoOriginal = localStorage.getItem('departamento') || 'TODOS';
        current.textContent = departamentoOriginal;

        fetch('assets/components/caracterizacion/departamentos/departamentos.php')
            .then(response => response.json())
            .then(data => {
                list.innerHTML = '<li data-value="TODOS" class="option">TODOS</li>';

                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(function (dep, index) {
                        var li = document.createElement('li');
                        li.className = 'option';
                        li.setAttribute('data-value', dep);
                        li.textContent = dep;

                        // Marcar como seleccionado si coincide con el FILTRO actual
                        if (normalizarTexto(dep) === departamentoFiltro) {
                            li.classList.add('selected');
                            current.textContent = dep;
                        }

                        list.appendChild(li);
                    });

                    // Si el filtro actual es "TODOS", marcarlo como seleccionado
                    if (departamentoFiltro === 'TODOS' || departamentoFiltro === '') {
                        const todosOption = list.querySelector('[data-value="TODOS"]');
                        if (todosOption) {
                            todosOption.classList.add('selected');
                            current.textContent = 'TODOS';
                        }
                    }
                }

                // Actualizar selección visual
                actualizarSeleccionDepartamento(departamentoFiltro || 'TODOS');
            })
            .catch(error => {
                console.error('Error:', error);
                list.innerHTML = '<li data-value="TODOS" class="option selected">TODOS</li>';
            });

        // Configurar eventos de clic - con verificación
        const niceSelect = document.querySelector('.nice-select');
        if (niceSelect) {
            niceSelect.addEventListener('click', function () {
                this.classList.toggle('open');
            });
        }

        // Event listener para selección
        list.addEventListener('click', function (event) {
            if (event.target && event.target.nodeName === "LI" && event.target.hasAttribute('data-value')) {
                var selectedValue = event.target.getAttribute('data-value');

                departamentoFiltro = normalizarTexto(selectedValue);
                current.textContent = selectedValue;

                actualizarURL();
                actualizarSeleccionDepartamento(selectedValue);
                cargarNoticias();

                document.querySelector('.nice-select').classList.remove('open');
            }
        });

        // Cerrar dropdown al hacer clic fuera
        document.addEventListener('click', function (event) {
            const niceSelect = document.querySelector('.nice-select');
            if (niceSelect && !departamentoContainer.contains(event.target)) {
                niceSelect.classList.remove('open');
            }
        });
    }
    

    // Función auxiliar para actualizar selección visual
    function actualizarSeleccionDepartamento(departamentoSeleccionado) {
        const list = document.getElementById('departamento-list');
        const opciones = list.querySelectorAll('li[data-value]');

        opciones.forEach(opcion => {
            opcion.classList.remove('selected', 'focus');
        });

        const opcionSeleccionada = list.querySelector(`[data-value="${departamentoSeleccionado}"]`);
        if (opcionSeleccionada) {
            opcionSeleccionada.classList.add('selected', 'focus');
        }
    }

    // Cargar banner
    function cargarBannerNoticias() {
        const bannerContainer = document.getElementById('banner');
        if (!bannerContainer) {
            console.error('No se encontró el contenedor del banner');
            return;
        }

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
                try {
                    return JSON.parse(text);
                } catch (e) {
                    console.error('Respuesta del banner no es JSON válido:', text);
                    throw new Error('Respuesta del servidor no es JSON válido');
                }
            })
            .then(data => {
                if (data.success && data.fotos?.length > 0) {
                    const banner = document.getElementById('banner');
                    let imagenUrl = './assets/images/placeholder.jpg';

                    try {
                        const fotoData = data.fotos[0].foto;
                        const jsonArray = JSON.parse(fotoData);
                        if (Array.isArray(jsonArray) && jsonArray[0]?.name) {
                            imagenUrl = convertLocalPathToUrl(jsonArray[0].name);
                        }
                    } catch (e) {
                        console.error("Error al parsear imagen del banner:", e);
                    }

                    banner.style.backgroundImage = `url('${imagenUrl}')`;
                    banner.style.backgroundSize = 'cover';
                    banner.style.backgroundPosition = 'center';
                    banner.style.backgroundRepeat = 'no-repeat';
                    banner.style.minHeight = '400px';
                    banner.style.display = 'flex';
                    banner.style.alignItems = 'center';
                    banner.style.justifyContent = 'center';

                    const bannerContent = banner.querySelector('.banner-content');
                    if (bannerContent) {
                        bannerContent.style.display = 'block';
                        bannerContent.style.opacity = '1';
                        bannerContent.style.zIndex = '10';
                        bannerContent.style.position = 'relative';
                    }
                } else {
                    cargarBannerFallback();
                }
            })
            .catch(error => {
                console.error('Error al cargar banner:', error);
                cargarBannerFallback();
            });
    }

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

        const bannerContent = banner.querySelector('.banner-content');
        if (bannerContent) {
            bannerContent.style.display = 'block';
            bannerContent.style.opacity = '1';
            bannerContent.style.zIndex = '10';
            bannerContent.style.position = 'relative';
        }
    }

    // Configurar búsqueda
    function configurarBusqueda() {
        const campoBusqueda = document.getElementById('buscador');
        if (!campoBusqueda) return;

        let timeoutId;

        campoBusqueda.addEventListener('input', function (event) {
            clearTimeout(timeoutId);
            const valorBusqueda = event.target.value.trim();

            timeoutId = setTimeout(function () {
                busquedaFiltro = valorBusqueda;
                actualizarURL();
                cargarNoticias();
            }, 300);
        });

        campoBusqueda.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                clearTimeout(timeoutId);
                busquedaFiltro = event.target.value.trim();
                actualizarURL();
                cargarNoticias();
            }
        });
    }

    // Configurar filtros de fecha
    function configurarFiltrosFecha() {
        const fechaDesde = document.getElementById('fecha-desde');
        const fechaHasta = document.getElementById('fecha-hasta');

        if (fechaDesde) {
            fechaDesde.addEventListener('change', function () {
                fechaDesdeFiltro = this.value;
                actualizarURL();
                cargarNoticias();
            });
        }

        if (fechaHasta) {
            fechaHasta.addEventListener('change', function () {
                fechaHastaFiltro = this.value;
                actualizarURL();
                cargarNoticias();
            });
        }
    }

    // Limpiar filtros
    function limpiarFiltros() {
        departamentoFiltro = 'TODOS';
        categoriaFiltro = '';
        busquedaFiltro = '';
        fechaDesdeFiltro = '';
        fechaHastaFiltro = '';
        paginaActual = 0;

        const url = new URL(window.location.href);
        url.searchParams.delete('departamento');
        url.searchParams.delete('categoria');
        url.searchParams.delete('buscar');
        url.searchParams.delete('fecha_desde');
        url.searchParams.delete('fecha_hasta');
        window.history.pushState({}, '', url);

        const current = document.getElementById('nombre_departamento');
        if (current) current.textContent = 'TODOS';

        const campoBusqueda = document.getElementById('buscador');
        if (campoBusqueda) campoBusqueda.value = '';

        const fechaDesde = document.getElementById('fecha-desde');
        if (fechaDesde) fechaDesde.value = '';

        const fechaHasta = document.getElementById('fecha-hasta');
        if (fechaHasta) fechaHasta.value = '';

        document.querySelectorAll('.category-link').forEach(link =>
            link.classList.remove('active')
        );

        actualizarSeleccionDepartamento('TODOS');
        cargarNoticias();
    }

    // Formatear fecha
    function formatearFecha(fechaString) {
        if (!fechaString) return 'Sin fecha';
        const fecha = new Date(fechaString);
        const ahora = new Date();
        const diferencia = ahora - fecha;
        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

        if (dias === 0) return 'Hoy';
        if (dias === 1) return 'Ayer';
        if (dias < 7) return `Hace ${dias} días`;

        return fecha.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    // Paginación
    function generarPaginacion(totalNoticias, noticiasPorPagina) {
        const container = document.querySelector('.shop-page__pagination');
        if (!container) return;

        const totalPaginas = Math.ceil(totalNoticias / noticiasPorPagina);
        if (totalPaginas <= 1) {
            container.innerHTML = '';
            return;
        }

        let html = '<ul class="pagination">';

        if (paginaActual > 0) {
            html += `<li class="page-item"><a class="page-link" href="#" onclick="event.preventDefault(); cambiarPagina(${paginaActual - 1})">‹</a></li>`;
        }

        for (let i = Math.max(0, paginaActual - 2); i <= Math.min(totalPaginas - 1, paginaActual + 2); i++) {
            const active = i === paginaActual ? 'active' : '';
            html += `<li class="page-item ${active}"><a class="page-link" href="#" onclick="event.preventDefault(); cambiarPagina(${i})">${i + 1}</a></li>`;
        }

        if (paginaActual < totalPaginas - 1) {
            html += `<li class="page-item"><a class="page-link" href="#" onclick="event.preventDefault(); cambiarPagina(${paginaActual + 1})">›</a></li>`;
        }

        html += '</ul>';
        container.innerHTML = html;
    }

    function mostrarInformacionResultados(total) {
        const container = document.querySelector('.product__showing-result');
        if (!container) return;

        const inicio = (paginaActual * 6) + 1;
        const fin = Math.min((paginaActual + 1) * 6, total);
        container.innerHTML = `<p>Mostrando ${inicio}-${fin} de ${total} noticias</p>`;
    }

    function cambiarPagina(nuevaPagina) {
        paginaActual = nuevaPagina;
        actualizarURL();
        cargarNoticias();
        const newsGrid = document.getElementById('events-close-to-you');
        if (newsGrid) newsGrid.scrollIntoView({ behavior: 'smooth' });
    }

    function cargarBoletinesPopulares() {
        const cardsContainer = document.getElementById('boletin-popular-carousel');
        if (!cardsContainer) return;

        cardsContainer.innerHTML = '<div class="loading-indicator" style="background-color: white;">Cargando boletines...</div>';

        fetch('assets/components/boletin/getBoletin.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                estado: 'Publicado',
                limite: 6,
                orden: 'fecha_publicacion',
                direccion: 'DESC',
                incluir_archivados: false // Solo boletines activos
            })
        })
            .then(response => response.json())
            .then(data => {
                cardsContainer.innerHTML = '';

                if (data.success && data.boletines && data.boletines.length > 0) {
                    data.boletines.forEach(boletin => {
                        const eventItem = document.createElement('div');
                        eventItem.classList.add('event-item', 'carousel-event-item');

                        // Manejar imagen del boletín
                        let imagenUrl = './assets/images/placeholder.jpg';
                        if (boletin.imagen_boletin) {
                            try {
                                // Si es un JSON array como en eventos
                                const arr = JSON.parse(boletin.imagen_boletin);
                                if (Array.isArray(arr) && arr[0] && arr[0].name) {
                                    imagenUrl = convertLocalPathToUrl(arr[0].name);
                                }
                            } catch (e) {
                                // Si es una ruta simple
                                imagenUrl = convertLocalPathToUrl(boletin.imagen_boletin);
                            }
                        }

                        // Formatear fecha de publicación
                        const fechaTexto = formatearFecha(boletin.fecha_publicacion);

                        // Determinar estado visual del boletín
                        const estadoEvento = boletin.estado === 'Publicado' ? 'Nuevo' : boletin.estado;

                        // Obtener resumen del contenido
                        const resumen = boletin.resumen || (boletin.contenido ?
                            boletin.contenido.substring(0, 150) + '...' :
                            'Sin descripción disponible');

                        eventItem.innerHTML = `
                            <div class="event-image">
                                <img src="${imagenUrl}" alt="${boletin.titulo}">
                                ${estadoEvento ? `<div class="event-status">${estadoEvento}</div>` : ''}
                            </div>
                            <div class="event-details">
                                <h3 class="event-title">${boletin.titulo}</h3>
                                <div class="event-info">
                                    <div class="event-date">${fechaTexto}</div>
                                    <div class="event-location">${boletin.nombre_municipio ? boletin.nombre_municipio + ', ' : ''}${boletin.departamento || 'Nacional'}</div>
                                    <div class="event-remaining">${resumen}</div>
                                </div>
                            </div>
                        `;

                        eventItem.addEventListener('click', function () {
                            // Incrementar vistas del boletín (si tienes esta funcionalidad)
                            if (typeof incrementarVistasBoletin === 'function') {
                                incrementarVistasBoletin(boletin.id_boletin);
                            }
                            window.location.href = `details_boletin.php?id=${boletin.id_boletin}`;
                        });

                        cardsContainer.appendChild(eventItem);
                    });

                    // Crear carousel para boletines (reutilizando la función de eventos)
                    if (typeof createEventsPopularCarousel === 'function') {
                        createEventsPopularCarousel();
                    }
                } else {
                    cardsContainer.innerHTML = '<div>No se encontraron boletines</div>';
                }
            })
            .catch(error => {
                console.error('Error al cargar boletines:', error);
                cardsContainer.innerHTML = '<div class="error-message">No se pudieron cargar los boletines</div>';
            });
    }

    // CARGAR DATOS INICIALES - ORDEN CORRECTO
    cargarNoticias();
    cargarCategorias();
    cargarDepartamentos(); // AGREGADO AQUÍ
    cargarBannerNoticias();
    configurarBusqueda();
    configurarFiltrosFecha();
    cargarBoletinesPopulares();

    // Exponer funciones globales
    window.cambiarPagina = cambiarPagina;
    window.limpiarFiltros = limpiarFiltros;
});

function borrarFiltros() {
    if (window.limpiarFiltros) {
        window.limpiarFiltros();
    }
}