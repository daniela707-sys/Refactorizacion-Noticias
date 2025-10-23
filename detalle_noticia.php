<?php
$auth = isset($_COOKIE['runnerSession']) ? true : false;
$id_noticia = isset($_GET['id']) ? $_GET['id'] : null;

$username = 'front@gmail.com';
$password = 'aprendiz23';
$auth_header = base64_encode("$username:$password");
?>
<!DOCTYPE html>
<html style="min-width: 300px;" lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Red Emprender</title>
    <link rel="apple-touch-icon" sizes="180x180" href="assets/images/logo/logo1.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="assets/images/logo/logo1.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="assets/images/logo/logo1.png" />
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Teko:wght@300;400;500&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="assets/vendors/bootstrap/css/bootstrap.min.css" />
    <link rel="stylesheet" href="assets/vendors/animate/animate.min.css" />
    <link rel="stylesheet" href="assets/vendors/fontawesome/css/all.min.css" />
    <link rel="stylesheet" href="assets/css/app.css">
    <link rel="stylesheet" href="assets/css/ogenix.css">
    <link rel="stylesheet" href="assets/css/ogenix-responsive.css">
    
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
</head>

<body class="custom-cursor">
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
    </div>

    <div>
        <?php require_once "assets/layout/offerofday.php"; ?>
        <?php require_once "assets/layout/header.php"; ?>
        
        <main id="main-content">
            <!-- Contenido dinámico de la noticia -->
        </main>
        
        <?php require_once "assets/layout/subscribe.php"; ?>
        <?php require_once "assets/layout/footer.php"; ?>
    </div>

    <script src="assets/vendors/jquery/jquery-3.6.0.min.js"></script>
    <script src="assets/vendors/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/detalles_noticia.js"></script>
    <script src="assets/js/ogenix.js"></script>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            window.addEventListener('load', function() {
                document.querySelector('.preloader').classList.add('hide');
            });
            
            setTimeout(function() {
                document.querySelector('.preloader').classList.add('hide');
            }, 3000);
        });
    </script>
</body>
</html>