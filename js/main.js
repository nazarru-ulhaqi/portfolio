// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Load and display projects
async function loadProjects() {
    try {
        const response = await fetch('data/projects.json');
        const projects = await response.json();
        displayProjects(projects);
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('projectsContainer').innerHTML = 
            '<p style="color: var(--text-secondary);">Unable to load projects at this time.</p>';
    }
}

function displayProjects(projects) {
    const container = document.getElementById('projectsContainer');
    
    container.innerHTML = projects.map(project => `
        <article class="project-card">
            <div class="project-header">
                <div class="project-logo">${project.logo}</div>
                <h3 class="project-title">${project.title}</h3>
            </div>
            <div class="project-links">
                ${project.paperUrl ? `<a href="${project.paperUrl}" target="_blank">Paper</a>` : ''}
                ${project.codeUrl ? `<a href="${project.codeUrl}" target="_blank">Code</a>` : ''}
            </div>
            <div class="project-date">${project.date}</div>
            <p class="project-description">${project.description}</p>
        </article>
    `).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', loadProjects);
