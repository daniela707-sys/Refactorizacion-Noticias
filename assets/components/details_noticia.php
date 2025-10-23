<?php
$auth = isset($_COOKIE['runnerSession']) ? true : false;
$id_noticia = isset($_GET['id']) ? $_GET['id'] : null;
?>

<style>
    /* ==========================================================================
    2. COMPONENTE BANNER
    ========================================================================== */
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
        color:rgb(255, 255, 255);
    }

    .banner p {
        font-size: 1.5rem;
        margin-bottom: 30px;
        color: white;
    }

    .dots {
        position: absolute;
        bottom: 20px;
        left: 40px;
        display: flex;
        gap: 10px;
        z-index: 1;
    }

    .dot {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        transition: background 0.3s;
    }

    .dot.active {
        background: #50A72C;
    }

    /* ==========================================================================
       SKELETON LOADING STYLES
       ========================================================================== */

    /* Keyframes para una animación más sutil */
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.8;
        }
    }

    @keyframes fadeInOut {
        0%, 100% {
            background-color: #f0f0f0;
        }
        50% {
            background-color: #e8e8e8;
        }
    }

    /* Clase base para elementos skeleton */
    .skeleton-line,
    .skeleton-image-main,
    .skeleton-circle,
    .skeleton-sidebar-title,
    .skeleton-post-image {
        background-color: #f0f0f0;
        animation: fadeInOut 2s ease-in-out infinite;
        border-radius: 8px;
    }

    /* Container principal del skeleton */
    .skeleton-container {
        padding: 40px 0;
        min-height: 70vh;
    }

    /* Skeleton imagen principal */
    .skeleton-image-main {
        width: 100%;
        height: 400px;
        margin-bottom: 30px;
        border-radius: 12px;
    }

    /* Skeleton meta información */
    .skeleton-meta {
        margin-bottom: 20px;
        display: flex;
        gap: 15px;
    }

    .skeleton-meta .skeleton-line {
        height: 16px;
    }

    /* Skeleton título */
    .skeleton-title {
        margin-bottom: 25px;
    }

    .skeleton-title .skeleton-line {
        height: 28px;
        margin-bottom: 8px;
    }

    /* Skeleton contenido */
    .skeleton-content {
        margin-bottom: 30px;
    }

    .skeleton-content .skeleton-line {
        height: 18px;
        margin-bottom: 12px;
    }

    /* Skeleton social buttons */
    .skeleton-social {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 30px;
    }

    .skeleton-circle {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    /* Skeleton sidebar */
    .skeleton-sidebar {
        padding: 20px;
        background: #f9f9f9;
        border-radius: 10px;
    }

    .skeleton-sidebar-title {
        height: 24px;
        width: 80%;
        margin-bottom: 25px;
        border-radius: 6px;
    }

    /* Skeleton posts del sidebar */
    .skeleton-sidebar-post {
        display: flex;
        gap: 15px;
        margin-bottom: 20px;
        align-items: flex-start;
    }

    .skeleton-post-image {
        width: 70px;
        height: 67px;
        flex-shrink: 0;
        border-radius: 8px;
    }

    .skeleton-post-content {
        flex: 1;
    }

    .skeleton-post-content .skeleton-line {
        height: 14px;
        margin-bottom: 8px;
    }

    /* Diferentes tamaños de líneas */
    .skeleton-line-short {
        width: 30%;
    }

    .skeleton-line-medium {
        width: 60%;
    }

    .skeleton-line-long {
        width: 80%;
    }

    .skeleton-line-full {
        width: 100%;
    }

    /* Responsive para skeleton */
    @media (max-width: 768px) {
        .skeleton-image-main {
            height: 250px;
        }
        
        .skeleton-meta {
            flex-direction: column;
            gap: 8px;
        }
        
        .skeleton-meta .skeleton-line {
            width: 50%;
        }
        
        .skeleton-title .skeleton-line {
            height: 24px;
        }
        
        .skeleton-content .skeleton-line {
            height: 16px;
            margin-bottom: 10px;
        }
        
        .skeleton-social {
            justify-content: center;
            gap: 8px;
        }
        
        .skeleton-circle {
            width: 35px;
            height: 35px;
        }
    }

    @media (max-width: 480px) {
        .skeleton-container {
            padding: 20px 0;
        }
        
        .skeleton-image-main {
            height: 200px;
            margin-bottom: 20px;
        }
        
        .skeleton-sidebar {
            margin-top: 30px;
            padding: 15px;
        }
        
        .skeleton-post-image {
            width: 60px;
            height: 57px;
        }
        
        .skeleton-sidebar-post {
            gap: 12px;
            margin-bottom: 15px;
        }
    }

    /* Animación de entrada para el contenido real */
    .fade-in-content {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }

    .fade-in-content.loaded {
        opacity: 1;
        transform: translateY(0);
    }

    /* Mejoras para la transición */
    .news-details {
        transition: opacity 0.5s ease, transform 0.5s ease;
    }

    /* Loading indicator mejorado */
    .loading-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px;
        color: #666;
        font-style: italic;
    }

    /* Error message styling */
    .error-message {
        text-align: center;
        padding: 40px 20px;
        background: #f8f9fa;
        border-radius: 10px;
        margin: 20px 0;
    }

    .error-message h3 {
        color: #dc3545;
        margin-bottom: 15px;
    }

    .error-message p {
        color: #666;
        margin-bottom: 20px;
    }

    .error-message button {
        background: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .error-message button:hover {
        background: #0056b3;
    }

    /* Spinner para el banner loading */
    .banner-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top: 4px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>

<div class="preloader">
    <div class="preloader__image"></div>
</div>

<div class="banner" id="banner">
    <div class="banner-loading" id="banner-loading">
        <div class="spinner"></div>
    </div>
    <div class="banner-content" id="banner-content" style="display: none;">
        <h1 id="noticia-titulo-banner">¡Noticias!</h1>
        <p id="noticia-descripcion-banner">Mantente informado</p>
    </div>
    <div class="dots" id="dots"></div>
</div>

<!--News Details Start-->
<main id="main-content">
    <!-- Aquí se insertará la estructura generada con skeleton loading -->
</main>
<!--News Details End-->

<!--Subscribe One Start-->

<script src="assets/js/details_noticia.js"></script>