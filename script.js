const PLANET_COUNT = 8;
const PLANET_MESSAGES = [
    "Sabah, your smile on 27/3, your birthday, lights up my universe.",
    "Since 6/1/2021, our first chat, my heart beats only for you.",
    "Your love is my constellation, guiding me through every night.",
    "Every moment with you feels like a star born just for us.",
    "Sabah, you’re my galaxy, infinite and breathtaking.",
    "Our love story began on 6/1/2021, and it’s my favorite tale.",
    "On your birthday, 27/3, I wished for you, and you came true.",
    "With you, Sabah, every day is a journey to the stars."
];

let planets = [];
let particles = [];

const introScreen = document.getElementById('introScreen');
const startButton = document.getElementById('startButton');
const planetsContainer = document.getElementById('planetsContainer');
const messagePopup = document.getElementById('messagePopup');
const planetMessage = document.getElementById('planetMessage');
const closeMessage = document.getElementById('closeMessage');
const addPlanetButton = document.getElementById('addPlanetButton');
const customPlanetContainer = document.getElementById('customPlanetContainer');
const customPlanetName = document.getElementById('customPlanetName');
const customPlanetMessage = document.getElementById('customPlanetMessage');
const submitCustomPlanet = document.getElementById('submitCustomPlanet');

document.addEventListener('DOMContentLoaded', init);

function init() {
    planetsContainer.style.display = 'none';
    messagePopup.style.display = 'none';
    customPlanetContainer.style.display = 'none';
    addPlanetButton.style.display = 'none';
    document.getElementById('fullscreenButton').style.display = 'none';
    startButton.addEventListener('click', startExperience);
    loadCustomPlanets();
}

function startExperience() {
    introScreen.style.opacity = '0';
    setTimeout(() => {
        introScreen.style.display = 'none';
        planetsContainer.style.display = 'block';
        addPlanetButton.style.display = 'block';
        document.getElementById('fullscreenButton').style.display = 'block';
        generatePlanets();
        setupEventListeners();
        initGalaxyCanvas();
    }, 500);
}

function generatePlanets() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    planetsContainer.innerHTML = '';
    planets = [];
    const MIN_DISTANCE = 100;
    for (let i = 0; i < PLANET_COUNT; i++) {
        let x, y, tooClose;
        do {
            x = Math.floor(Math.random() * (width - 60));
            y = Math.floor(Math.random() * (height - 60));
            tooClose = planets.some(planet => {
                const dx = planet.x - x;
                const dy = planet.y - y;
                return Math.sqrt(dx * dx + dy * dy) < MIN_DISTANCE;
            });
        } while (tooClose);
        const planet = document.createElement('div');
        planet.className = 'planet';
        const size = Math.random() * 20 + 20;
        planet.style.width = `${size}px`;
        planet.style.height = `${size}px`;
        planet.style.left = `${x}px`;
        planet.style.top = `${y}px`;
        planet.style.background = `hsl(${i % 2 === 0 ? 330 : 270}, 70%, 60%)`;
        if (i === 0) createDatePattern(planet, '27/3', size, x, y); // Sabah's birthday
        if (i === 1) createDatePattern(planet, '6/1/2021', size, x, y); // First chat
        const planetData = { element: planet, x, y, message: PLANET_MESSAGES[i], size };
        planets.push(planetData);
        planetsContainer.appendChild(planet);
        planet.addEventListener('click', () => showMessage(planetData));
    }
}

function createDatePattern(planet, dateString, size, x, y) {
    const chars = dateString.replace(/\//g, '').split('');
    const totalChars = chars.length;
    const radius = size / 2;
    for (let i = 0; i < totalChars; i++) {
        const angle = ((i / totalChars) * Math.PI * 2);
        const px = x + size / 2 + Math.cos(angle) * radius;
        const py = y + size / 2 + Math.sin(angle) * radius;
        const point = document.createElement('div');
        point.className = 'planet-point';
        point.style.left = `${px}px`;
        point.style.top = `${py}px`;
        planetsContainer.appendChild(point);
    }
}

function loadCustomPlanets() {
    const customPlanets = JSON.parse(localStorage.getItem('customPlanets')) || [];
    customPlanets.forEach(planet => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const planetElement = document.createElement('div');
        planetElement.className = 'planet custom-planet';
        planetElement.style.width = `${planet.size}px`;
        planetElement.style.height = `${planet.size}px`;
        planetElement.style.left = `${planet.x}px`;
        planetElement.style.top = `${planet.y}px`;
        planetElement.style.background = planet.color;
        const planetData = { 
            element: planetElement, 
            x: planet.x, 
            y: planet.y, 
            message: `${planet.name}: ${planet.message}`, 
            size: planet.size 
        };
        planets.push(planetData);
        planetsContainer.appendChild(planetElement);
        planetElement.addEventListener('click', () => showMessage(planetData));
    });
}

function showMessage(planetData) {
    planetMessage.textContent = planetData.message;
    messagePopup.style.display = 'flex';
    messagePopup.classList.add('visible');
    createParticles(planetData.x + planetData.size / 2, planetData.y + planetData.size / 2, 15);
}

function createParticles(x, y, count) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.background = `hsl(${Math.random() * 60 + 300}, 80%, 70%)`;
        document.body.appendChild(particle);
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        let opacity = 1;
        let posX = x;
        let posY = y;
        const animate = () => {
            opacity -= 0.015;
            posX += vx;
            posY += vy;
            particle.style.opacity = opacity;
            particle.style.left = `${posX}px`;
            particle.style.top = `${posY}px`;
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        requestAnimationFrame(animate);
    }
}

function initGalaxyCanvas() {
    const canvas = document.getElementById('galaxyCanvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const stars = [];
    const nebulas = [];
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5,
            opacity: Math.random() * 0.5 + 0.2
        });
    }
    for (let i = 0; i < 3; i++) {
        nebulas.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 200 + 100,
            color: `hsl(${300 + Math.random() * 30}, 50%, 30%)`
        });
    }
    function animateGalaxy() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        nebulas.forEach(nebula => {
            const gradient = ctx.createRadialGradient(nebula.x, nebula.y, 0, nebula.x, nebula.y, nebula.radius);
            gradient.addColorStop(0, nebula.color);
            gradient.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        });
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
            star.opacity += (Math.random() - 0.5) * 0.02;
            if (star.opacity < 0.2) star.opacity = 0.2;
            if (star.opacity > 0.7) star.opacity = 0.7;
        });
        requestAnimationFrame(animateGalaxy);
    }
    animateGalaxy();
}

function setupEventListeners() {
    window.addEventListener('resize', debounce(() => {
        if (introScreen.style.display === 'none') {
            const canvas = document.getElementById('galaxyCanvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            generatePlanets();
            initGalaxyCanvas();
        }
    }, 250));
    closeMessage.addEventListener('click', () => {
        messagePopup.classList.remove('visible');
        setTimeout(() => {
            messagePopup.style.display = 'none';
        }, 300);
    });
    addPlanetButton.addEventListener('click', () => {
        customPlanetContainer.style.display = 'flex';
        customPlanetContainer.classList.add('visible');
    });
    submitCustomPlanet.addEventListener('click', () => {
        const name = customPlanetName.value.trim();
        const message = customPlanetMessage.value.trim();
        if (name && message) {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const x = Math.random() * (width - 60);
            const y = Math.random() * (height - 60);
            const size = Math.random() * 20 + 20;
            const color = `hsl(${Math.random() * 60 + 300}, 70%, 60%)`;
            const planetElement = document.createElement('div');
            planetElement.className = 'planet custom-planet';
            planetElement.style.width = `${size}px`;
            planetElement.style.height = `${size}px`;
            planetElement.style.left = `${x}px`;
            planetElement.style.top = `${y}px`;
            planetElement.style.background = color;
            const planetData = { element: planetElement, x, y, message: `${name}: ${message}`, size };
            planets.push(planetData);
            planetsContainer.appendChild(planetElement);
            planetElement.addEventListener('click', () => showMessage(planetData));
            const customPlanets = JSON.parse(localStorage.getItem('customPlanets')) || [];
            customPlanets.push({ x, y, size, color, name, message });
            localStorage.setItem('customPlanets', JSON.stringify(customPlanets));
            customPlanetContainer.classList.remove('visible');
            setTimeout(() => {
                customPlanetContainer.style.display = 'none';
                customPlanetName.value = '';
                customPlanetMessage.value = '';
            }, 300);
        }
    });
    const fullscreenButton = document.getElementById('fullscreenButton');
    fullscreenButton.addEventListener('click', toggleFullScreen);
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error('Failed to enter fullscreen:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}