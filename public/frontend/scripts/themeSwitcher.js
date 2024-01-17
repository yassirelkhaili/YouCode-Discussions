/**
 * @author Yassir Elkhaili
 * @license MIT
*/
var currentTheme = "";
var handleInitialTheme = function () {
    var rootClasses = ["transition", "duration-100"];
    rootClasses.forEach(function (rootClass) {
        return document.documentElement.classList.add(rootClass);
    });
    var themeStored = localStorage.getItem("color-theme");
    if (themeStored === "dark" || (themeStored === null && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("color-theme", "dark");
        currentTheme = "dark";
    }
    else {
        localStorage.setItem("color-theme", "light");
        currentTheme = "light";
    }
};
handleInitialTheme();
document.addEventListener("DOMContentLoaded", function () {
    var themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
    var themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");
    var themeToggleBtn = document.getElementById("theme-toggle");
    var dropDown = document.querySelector("#selectThemeDropdown");
    //handle theme switch
    var toggleLightTheme = function () {
        document.documentElement.classList.remove("dark");
        themeToggleLightIcon === null || themeToggleLightIcon === void 0 ? void 0 : themeToggleLightIcon.classList.remove("hidden");
        themeToggleDarkIcon === null || themeToggleDarkIcon === void 0 ? void 0 : themeToggleDarkIcon.classList.add("hidden");
        localStorage.setItem("color-theme", "light");
        currentTheme = "light";
    };
    var toggleDarkTheme = function () {
        document.documentElement.classList.add("dark");
        themeToggleDarkIcon === null || themeToggleDarkIcon === void 0 ? void 0 : themeToggleDarkIcon.classList.remove("hidden");
        themeToggleLightIcon === null || themeToggleLightIcon === void 0 ? void 0 : themeToggleLightIcon.classList.add("hidden");
        localStorage.setItem("color-theme", "dark");
        currentTheme = "dark";
    };
    //handle dropdownMenu toggle
    var toggleThemeDropdown = function () {
        if (dropDown.classList.contains("hidden")) {
            dropDown.classList.remove("hidden");
            setTimeout(function () {
                dropDown.classList.add("opacity-100");
                dropDown.classList.add("translate-y-0");
            }, 1);
            setTimeout(function () {
                dropDown.classList.remove("opacity-0");
                dropDown.classList.remove("translate-y-3");
            }, 99);
        }
        else {
            dropDown.classList.remove("opacity-100");
            dropDown.classList.remove("translate-y-0");
            dropDown.classList.add("opacity-0");
            dropDown.classList.add("translate-y-3");
            setTimeout(function () {
                dropDown.classList.add("hidden");
            }, 200);
        }
    };
    themeToggleBtn &&
        themeToggleBtn.addEventListener("click", toggleThemeDropdown);
    var handleInitialThemeIcon = function () {
        currentTheme === "dark" ? themeToggleDarkIcon.classList.remove('hidden') : themeToggleLightIcon.classList.remove('hidden');
    };
    handleInitialThemeIcon();
    //close dropdown on outside click
    var handleOutsideClick = function (element, event) {
        var target = event.target;
        if (element) {
            if (target !== dropDown &&
                !element.contains(target) &&
                element.classList.contains("opacity-100"))
                toggleThemeDropdown();
        }
    };
    window.addEventListener("click", handleOutsideClick.bind(null, dropDown));
    //toggle theme
    var handleThemeSwitchBtnClick = function (index) {
        console.log("triggered");
        if (index === 0) {
            window.matchMedia("(prefers-color-scheme: dark)").matches
                ? toggleDarkTheme()
                : toggleLightTheme();
            localStorage.setItem("color-theme", "auto");
        }
        else if (index === 1) {
            toggleLightTheme();
        }
        else {
            toggleDarkTheme();
        }
        toggleThemeDropdown();
    };
    if (dropDown) {
        var childrenArray = Array.from(dropDown.children);
        childrenArray.forEach(function (child, index) {
            child.addEventListener("click", handleThemeSwitchBtnClick.bind(null, index));
        });
    }
    //end theme switcher logic
});
