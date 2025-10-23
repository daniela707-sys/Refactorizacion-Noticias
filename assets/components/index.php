<div class="preloader">
    <div class="preloader__image"></div>
</div>

<div class="banner" id="banner">
    <div class="banner-content">
        <h1>¡Bienvenido!</h1>
        <p>Descubre lo mejor para ti</p>
    </div>
    <div class="dots" id="dots"></div>
</div>

<div class="events-container">
    <div class="row">
        <!-- Filtros (Barra lateral) -->
        <div class="col-xl-3 col-lg-3">
            <div class="product__sidebar">
                <div class="shop-search product__sidebar-single">
                    <form action="#" method="GET">
                        <div class="search-bar">
                            <input id="buscador" type="text" name="buscar" placeholder="Buscar noticias...">
                        </div>
                    </form>
                </div>
                <div style="margin: 20px 0px; width: 100%;" class="shop-search product__sidebar">
                    <button class="btn btn-primary" onclick="borrarFiltros()" style="width: 100%;">Borrar filtros</button>
                </div>

                <div style="margin-top: 20px; height: 125px;" class="shop-best-sellers product__sidebar-single">
                    <h3 class="product__sidebar-title">Departamento</h3>
                    <select id="departamento-select" name="departamento">
                        <!-- Las opciones se agregarán dinámicamente -->
                    </select>
                    <div class="nice-select" tabindex="0">
                        <span id="nombre_departamento" class="current"></span>
                        <ul class="list" id="departamento-list">
                            <!-- Las opciones se agregarán dinámicamente a excepcion de todos -->
                            <li data-value="todos" class="option selected focus">TODOS</li>
                        </ul>
                    </div>
                </div>

                <div class="shop-category product__sidebar-single">
                    <h3 class="product__sidebar-title">Filtrar por Fecha</h3>
                    <div class="date-inputs">
                        <div class="date-input-group">
                            <label for="fecha-desde">Desde:</label>
                            <input type="date" id="fecha-desde" name="fecha-desde">
                        </div>
                        <div class="date-input-group">
                            <label for="fecha-hasta">Hasta:</label>
                            <input type="date" id="fecha-hasta" name="fecha-hasta">
                        </div>
                    </div>
                </div>

                <div style="margin: 30px 0px;" class="shop-category product__sidebar-single">
                    <h3 class="product__sidebar-title">Categorías de Noticias</h3>
                    <ul class="list-unstyled" id="category-event-list">
                        <!-- Los elementos de la lista se agregarán dinámicamente aquí -->
                    </ul>
                </div>

            </div>
        </div>

        <!-- Eventos (Contenido principal) -->
        <div class="col-xl-9 col-lg-9">
            <div class="product__items">
                <div class="row">
                    <div class="col-xl-12">
                        <div class="product__showing-result"></div>
                    </div>
                </div>
                <div class="events-grid" id="events-close-to-you"></div>
                <div class="shop-page__pagination"></div>
            </div>
        </div>
    </div>

</div>

<div class="events-container events-carousel-container" style="padding: 10px 20px 20px 20px;">
    <h2 class="events-heading">
        Boletines informativos
        <div class="carousel-navigation" style="align-items: center !important;">
            <h2 class="boletin-news-see-more">Ver más</h2>
            <div class="nav-button prev">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="currentColor" />
                </svg>
            </div>
            <div class="nav-button next">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z" fill="currentColor" />
                </svg>
            </div>
        </div>
    </h2>
    <div class="cards-container" id="boletin-popular-carousel"></div>
</div>

<script src="assets/js/index.js"></script>