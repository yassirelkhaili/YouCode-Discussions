<?php
// App root

session_start();

require dirname(__DIR__) . "/vendor/autoload.php";

require_once dirname(__DIR__) . "/loadenv.php";

include dirname(__DIR__) . "/SimpleKit/Routers/router.php";