/**
 * @author Yassir Elkhaili
 * @license MIT
*/


/**
 * @property {string} currentTheme
 * @description keeps track of the current theme
 */
/**
 * 
 * @type {string}
 */
let currentTheme: string = "";

const handleInitialTheme = () => {
  const rootClasses: Array<string> = ["transition", "duration-100"];
  rootClasses.forEach((rootClass: string) =>
    document.documentElement.classList.add(rootClass)
  );

const themeStored = localStorage.getItem("color-theme");
if (themeStored === "dark" || (themeStored === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("color-theme", "dark");
    currentTheme = "dark";
} else {
    localStorage.setItem("color-theme", "light");
    currentTheme = "light";
}
};

handleInitialTheme();

document.addEventListener("DOMContentLoaded", () => {
    const themeToggleDarkIcon = document.getElementById(
        "theme-toggle-dark-icon"
      ) as HTMLElement;
      const themeToggleLightIcon = document.getElementById(
        "theme-toggle-light-icon"
      ) as HTMLElement;
      const themeToggleBtn = document.getElementById(
        "theme-toggle"
      ) as HTMLButtonElement;
      const dropDown = document.querySelector(
        "#selectThemeDropdown"
      ) as HTMLDivElement;
    
      /**
       * @function toggleLightTheme
       * @returns {void}
       * @description Toggles light theme
       */
      const toggleLightTheme = (): void => {
        document.documentElement.classList.remove("dark");
        themeToggleLightIcon?.classList.remove("hidden");
        themeToggleDarkIcon?.classList.add("hidden");
        localStorage.setItem("color-theme", "light");
        currentTheme = "light";
      };
    
      const toggleDarkTheme = (): void => {
        document.documentElement.classList.add("dark");
        themeToggleDarkIcon?.classList.remove("hidden");
        themeToggleLightIcon?.classList.add("hidden");
        localStorage.setItem("color-theme", "dark");
        currentTheme = "dark";
      };
    
      /**
       * @function toggleThemeDropdown
       * @description handles theme dropdown toggle animation
       * @returns {void}
       */
      const toggleThemeDropdown = (): void => {
        if (dropDown.classList.contains("hidden")) {
          dropDown.classList.remove("hidden");
          setTimeout(() => {
            dropDown.classList.add("opacity-100");
            dropDown.classList.add("translate-y-0");
          }, 1);
          setTimeout(() => {
            dropDown.classList.remove("opacity-0");
            dropDown.classList.remove("translate-y-3");
          }, 99);
        } else {
          dropDown.classList.remove("opacity-100");
          dropDown.classList.remove("translate-y-0");
          dropDown.classList.add("opacity-0");
          dropDown.classList.add("translate-y-3");
          setTimeout(() => {
            dropDown.classList.add("hidden");
          }, 200);
        }
      };
    
      themeToggleBtn &&
        themeToggleBtn.addEventListener("click", toggleThemeDropdown);

    const handleInitialThemeIcon = (): void => {
        currentTheme === "dark" ? themeToggleDarkIcon.classList.remove('hidden') : themeToggleLightIcon.classList.remove('hidden');
    }

    handleInitialThemeIcon();
    
    /**
     * @function handleOutsideClick
     * @description Closes theme dropdown on outside click
     * @returns {void}
     * @param element - Element being clicked
     * @param event
     */ 
      const handleOutsideClick = (element: HTMLElement, event: Event): void => {
        const target = event.target as HTMLElement;
        if (element) {
          if (
            target !== dropDown &&
            !element.contains(target) &&
            element.classList.contains("opacity-100")
          )
            toggleThemeDropdown();
        }
      };
    
      window.addEventListener("click", handleOutsideClick.bind(null, dropDown));
    
      //toggle theme
      const handleThemeSwitchBtnClick = (index: number) => {
        console.log("triggered")
        if (index === 0) {
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? toggleDarkTheme()
            : toggleLightTheme();
          localStorage.setItem("color-theme", "auto");
        } else if (index === 1) {
          toggleLightTheme();
        } else {
          toggleDarkTheme();
        }
        toggleThemeDropdown();
      };
    
      if (dropDown) {
        const childrenArray = Array.from(dropDown.children);
        childrenArray.forEach((child: Element, index: number) => {
            child.addEventListener(
                "click",
                handleThemeSwitchBtnClick.bind(null, index)
              );
        })
      }
      
      //end theme switcher logic
})