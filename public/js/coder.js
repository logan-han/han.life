// Hugo Coder theme inspired JavaScript

const body = document.body;
const darkModeToggle = document.getElementById('dark-mode-toggle');
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

// Check if user preference is set, if not check value of body class for light or dark else it means that colorscheme = auto
if (localStorage.getItem("colorscheme")) {
    setTheme(localStorage.getItem("colorscheme"));
} else if (body.classList.contains('colorscheme-light') || body.classList.contains('colorscheme-dark')) {
    setTheme(body.classList.contains("colorscheme-dark") ? "dark" : "light");
} else {
    setTheme(darkModeMediaQuery.matches ? "dark" : "light");
}

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        let theme = body.classList.contains("colorscheme-dark") ? "light" : "dark";
        setTheme(theme);
        rememberTheme(theme);
    });
}

darkModeMediaQuery.addEventListener('change', (event) => {
    if (!localStorage.getItem("colorscheme")) {
        setTheme(event.matches ? "dark" : "light");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    let node = document.querySelector('.preload-transitions');
    if (node) {
        node.classList.remove('preload-transitions');
    }
});

function setTheme(theme) {
    body.classList.remove('colorscheme-light', 'colorscheme-dark');
    body.classList.add('colorscheme-' + theme);
    
    // Fire a custom event for theme change
    const event = new CustomEvent('themeChanged', { detail: theme });
    document.dispatchEvent(event);
}

function rememberTheme(theme) {
    localStorage.setItem('colorscheme', theme);
}
