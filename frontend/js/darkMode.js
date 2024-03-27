function darkModeToggle() {
    const toggleBtn = document.getElementById('toggleBtn');
    const content = document.getElementById('content');
    const sunIcon = document.getElementById('sunIcon');

    function toggleDarkMode() {
        content.classList.toggle('dark-mode');
        const isDarkMode = content.classList.contains('dark-mode');
        sunIcon.textContent = isDarkMode ? 'wb_sunny' : 'nights_stay';
    }

    function setupEvents() {
        toggleBtn.addEventListener('click', () => {
            toggleDarkMode();
        });
    }

    // Inicialização
    setupEvents();

    return {
        toggleDarkMode
    };
}

const darkModeToggler = darkModeToggle();


