<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="<?= $cssurl ?>">
  <script src="../public/frontend/scripts/themeSwitcher.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: {
              "50": "#eff6ff",
              "100": "#dbeafe",
              "200": "#bfdbfe",
              "300": "#93c5fd",
              "400": "#60a5fa",
              "500": "#3b82f6",
              "600": "#2563eb",
              "700": "#1d4ed8",
              "800": "#1e40af",
              "900": "#1e3a8a",
              "950": "#172554"
            },
            main_header: '#1F2937',
            border_color: '#374151',
            main_background_color: '#111827'
          }
        }
      }
    }
  </script>
  <title><?= $pageTitle ?></title>
</head>

<body class="dark:bg-main_background_color bg-white">
  <header class="absolute w-full flex px-6 justify-between items-center h-[4.4rem] border-b-[1px] dark:border-border_color border-white dark:bg-main_header bg-white">
    <div>
      <a href="/"><img src="../../public/frontend/src/images/brandlogo.webp" alt="WebCraft logo" class="h-[50px] w-[240px]"></a>
    </div>
    <div id="header"></div>
    <div class="flex justify-center items-center gap-2">
    <div class="flex justify-center items-center gap-3">
      <div id="theme-switcher" class="relative">
        <div id="selectThemeDropdown" class="transform translate-y-3 hidden herothird:right-[-18px] right-[-50px] min-w-[11rem] top-[2.5rem] mt-2 z-10 opacity-0 transition duration-200 mb-2 origin-bottom-left bg-white shadow-md rounded-lg p-2 space-y-1 dark:bg-gray-800 dark:border dark:border-gray-700 dark:divide-gray-700 absolute">
          <a class="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 cursor-pointer">
            Auto (system default)
          </a>
          <a class="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 cursor-pointer">
            Default (light mode)
          </a>
          <a class="flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 cursor-pointer">
            Dark
          </a>
        </div>
      </div>
      <button id="theme-toggle" type="button" class="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5">
        <svg id="theme-toggle-dark-icon" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
        </svg>
        <svg id="theme-toggle-light-icon" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path>
        </svg>
      </button>
    </div>
    <?php if (isset($_SESSION["session_token"])) : ?>
      <?php if ($_SESSION['user_role'] === 'admin') : ?>
        <a href="/dashboard">
          <button class="bg-blue-500 hover:bg-blue-600 text-slate-50 font-bold py-2 px-4 rounded focus:ring-4 focus:border-blue-200 border-blue-700">
            Dashboard
          </button>
        </a>
      <?php else : ?>
        <a href="/craftwiki">
          <button class="bg-blue-500 hover:bg-blue-600 text-slate-50 font-bold py-2 px-4 rounded focus:ring-4 focus:border-blue-200 border-blue-700">
            Craft
          </button>
        </a>
      <?php endif; ?>

      <a href="/logout">
        <button type="button" class="border border-blue-700 focus:ring-4 font-medium rounded text-sm px-5 py-2.5 text-center text-slate-50">
          Logout
        </button>
      </a>
    <?php else : ?>
      <a href="/login">
        <button type="button" class="border border-blue-700 focus:ring-4 font-medium rounded text-sm px-5 py-2.5 text-center text-slate-50">
          Sign In
        </button>
      </a>
      <a href="/register">
        <button class="bg-blue-500 hover:bg-blue-600 text-slate-50 font-bold py-2 px-4 rounded focus:ring-4 focus:border-blue-200 border-blue-700">
          Register
        </button>
      </a>
    <?php endif; ?>
    </a>
    </div>
  </header>