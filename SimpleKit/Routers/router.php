<?php

namespace SimpleKit\Routers;

use SimpleKit\Controllers\HomeController;
use SimpleKit\Controllers\AuthController;
use SimpleKit\Controllers\CategoryController;
use SimpleKit\Controllers\ThreadController;
use SimpleKit\Middleware\AuthMiddleware;
use SimpleKit\Middleware\Cors;

//add cors using middleware

Cors::handle();

//initialize BaseRouter

$router = new BaseRouter();

// Add more routes here

//render routes
$router->addRoute('/', HomeController::class, 'renderHome');
$router->addRoute('/login', HomeController::class,'renderLogin');
$router->addRoute('/register', HomeController::class,'renderRegister');
$router->addRoute('/edit/{id}', HomeController::class,'renderEdit', AuthMiddleware::class, 'handleCraftPage');

//wiki dynamic single page
$router->addRoute('/wiki/{id}', HomeController::class,'show');

//protected routes

$router->addRoute('/dashboard', HomeController::class,'renderDashboard', AuthMiddleware::class);
$router->addRoute('/craftwiki', HomeController::class,'renderCraftwiki', AuthMiddleware::class, 'handleCraftPage');

// authentication routes

$router->addRoute('/authorize', AuthController::class,'authenticate');
$router->addRoute('/registeruser', AuthController::class,'register');
$router->addRoute('/validate', AuthController::class,'validate');
$router->addRoute('/logout', AuthController::class,'logout');

//crud


//threads

$router->addRoute('/fetchwikis', ThreadController::class, 'indexUserWikis', AuthMiddleware::class, 'handleCraftPage');
$router->addRoute('/fetchwikisadmin', ThreadController::class, 'index');
$router->addRoute('/createwiki', HomeController::class,'renderCreateWiki', AuthMiddleware::class, 'handleCraftPage');
$router->addRoute('/postwiki', ThreadController::class, 'create', AuthMiddleware::class, 'handleCraftPage');
$router->addRoute('/editwiki/{id}', ThreadController::class, 'edit', AuthMiddleware::class, 'handleCraftPage');
$router->addRoute('/deletewiki/{id}', ThreadController::class,'destroy', AuthMiddleware::class, 'handleCraftPage');
$router->addRoute('/fetchWiki/{id}', HomeController::class,'fetch');
//categories

$router->addRoute('/postcategory', CategoryController::class, 'store', AuthMiddleware::class);
$router->addRoute('/fetchcategories', CategoryController::class,'fetchCategories');
$router->addRoute('/createcategory', HomeController::class,'renderCategoryCreate');
$router->addRoute('/fetchcategory/{id}', CategoryController::class,'fetch', AuthMiddleware::class);
$router->addRoute('/deletecategory/{id}', CategoryController::class,'destroy', AuthMiddleware::class);
$router->addRoute('/editcategory/{id}', HomeController::class,'renderCategoryEdit', AuthMiddleware::class);
$router->addRoute('/editcategoryroute/{id}', CategoryController::class,'edit', AuthMiddleware::class);

$uri = $_SERVER['REQUEST_URI'];

try {
    $router->dispatch($uri);
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
