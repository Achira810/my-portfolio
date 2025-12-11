// ==========================================
// UI INTERACTIONS
// ==========================================

// Loading Screen with Progress Animation
window.addEventListener('load', () => {
    const progressBar = document.getElementById('progressBar');
    const loaderPercentage = document.getElementById('loaderPercentage');
    const loadingScreen = document.getElementById('loading');

    // Create particles
    const particlesContainer = document.getElementById('loadingParticles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random positioning and animation
        const randomX = Math.random() * 100;
        const randomDelay = Math.random() * 5;
        const randomDuration = 3 + Math.random() * 4;
        const randomDrift = (Math.random() - 0.5) * 200;

        particle.style.left = randomX + '%';
        particle.style.animationDelay = randomDelay + 's';
        particle.style.animationDuration = randomDuration + 's';
        particle.style.setProperty('--drift', randomDrift + 'px');

        particlesContainer.appendChild(particle);
    }

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;

        progressBar.style.width = progress + '%';
        loaderPercentage.textContent = Math.floor(progress) + '%';

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 500);
        }
    }, 100);
});

// Mobile Menu Toggle
const hamburger = document.querySelector(".hamburger");
const navLinksContainer = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links li");

hamburger.addEventListener('click', () => {
    navLinksContainer.classList.toggle("active");
    hamburger.classList.toggle("active");
});

// Close mobile menu when a link is clicked
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinksContainer.classList.remove("active");
        hamburger.classList.remove("active");
    });
});

// Custom Cursor with Whip Trail
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

// Create trail elements
const trailLength = 15;
const trail = [];
const trailPositions = [];

for (let i = 0; i < trailLength; i++) {
    const dot = document.createElement('div');
    dot.className = 'cursor-trail';
    document.body.appendChild(dot);
    trail.push(dot);
    trailPositions.push({ x: 0, y: 0 });
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';

    // Update trail positions with smooth interpolation
    trailPositions[0].x = mouseX;
    trailPositions[0].y = mouseY;

    for (let i = 1; i < trailLength; i++) {
        trailPositions[i].x += (trailPositions[i - 1].x - trailPositions[i].x) * 0.4;
        trailPositions[i].y += (trailPositions[i - 1].y - trailPositions[i].y) * 0.4;

        const scale = 1 - (i / trailLength);
        const opacity = 1 - (i / trailLength);

        trail[i].style.left = trailPositions[i].x + 'px';
        trail[i].style.top = trailPositions[i].y + 'px';
        trail[i].style.transform = `translate(-50%, -50%) scale(${scale})`;
        trail[i].style.opacity = opacity;
    }

    requestAnimationFrame(animateFollower);
}
animateFollower();

// Scroll Progress
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scrollProgress');
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const htmlElement = document.documentElement;

const currentTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = htmlElement.getAttribute('data-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    updateThreeJsColors();
});

function updateThemeIcon(theme) {
    if (theme === 'light') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// Navbar Scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ==========================================
// ACTIVE NAVIGATION HIGHLIGHTING
// ==========================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

function highlightActiveNav() {
    const scrollY = window.scrollY;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Update on scroll
window.addEventListener('scroll', highlightActiveNav);

// Update on load
window.addEventListener('load', highlightActiveNav);

// ==========================================
// THREE.JS ANIMATIONS
// ==========================================
const bgScene = new THREE.Scene();
const bgCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const bgRenderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('three-canvas'),
    alpha: true,
    antialias: true
});
bgRenderer.setSize(window.innerWidth, window.innerHeight);
bgCamera.position.z = 5;

// Stars
const starGeometry = new THREE.BufferGeometry();
const starCount = 5000;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) {
    starPositions[i] = (Math.random() - 0.5) * 200;
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    transparent: true,
    opacity: 0.8,
});
const stars = new THREE.Points(starGeometry, starMaterial);
bgScene.add(stars);

// Lights
bgScene.add(new THREE.AmbientLight(0xffffff, 0.5));
const pointLight = new THREE.PointLight(0x00f2fe, 2);
pointLight.position.set(5, 5, 5);
bgScene.add(pointLight);

// Lottie Animations for About and Skills
const aboutLottie = lottie.loadAnimation({
    container: document.getElementById('about-lottie'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'assets/Developer.json'
});

const skillsLottie = lottie.loadAnimation({
    container: document.getElementById('skills-lottie'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'assets/Coding Slide.json'
});


// Update Three.js Colors (only for background stars)
function updateThreeJsColors() {
    // Only background stars remain, no color changes needed
}

// Animate Three.js (only background stars)
function animate() {
    requestAnimationFrame(animate);
    stars.rotation.y += 0.0002;

    bgRenderer.render(bgScene, bgCamera);
}
animate();

// Handle Resize
window.addEventListener('resize', () => {
    // Update Background Camera
    bgCamera.aspect = window.innerWidth / window.innerHeight;
    bgCamera.updateProjectionMatrix();
    bgRenderer.setSize(window.innerWidth, window.innerHeight);
});

// ==========================================
// SCROLL REVEAL & SKILLS
// ==========================================
const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const width = entry.target.getAttribute('data-width');
            entry.target.style.width = width;
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
skillBars.forEach(bar => skillObserver.observe(bar));

// Enhanced Card Animations with variety
const cards = document.querySelectorAll('.skill-item, .project-card, .contact-card, .info-item, .contact-form-wrapper');
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                entry.target.style.opacity = '1';
            }, index * 100);
            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });
cards.forEach(card => {
    card.style.opacity = '0';
    cardObserver.observe(card);
});

// Animate Section Titles - Simple Fade In
const sectionTitles = document.querySelectorAll('.section-title');

const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            titleObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

sectionTitles.forEach(title => {
    title.style.opacity = '0';
    title.style.transform = 'translateY(30px)';
    title.style.transition = 'all 0.8s ease';
    titleObserver.observe(title);
});

// Animate About Section Elements
const aboutImage = document.querySelector('.about-image');
const aboutText = document.querySelector('.about-text');
const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (aboutImage) {
                aboutImage.style.animation = 'fadeInLeft 0.8s ease forwards';
                aboutImage.style.opacity = '1';
            }
            if (aboutText) {
                aboutText.style.animation = 'fadeInRight 0.8s ease 0.3s forwards';
                aboutText.style.opacity = '1';
            }
            aboutObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });
if (aboutImage) {
    aboutImage.style.opacity = '0';
    aboutObserver.observe(aboutImage);
}

// Animate Skills Section Elements (swapped)
const skillsList = document.querySelector('.skills-list');
const skillsVisual = document.querySelector('.skills-visual');
const skillsSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (skillsList) {
                skillsList.style.animation = 'fadeInLeft 0.8s ease forwards';
                skillsList.style.opacity = '1';
            }
            if (skillsVisual) {
                skillsVisual.style.animation = 'fadeInRight 0.8s ease 0.3s forwards';
                skillsVisual.style.opacity = '1';
            }
            skillsSectionObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });
if (skillsList) {
    skillsList.style.opacity = '0';
    skillsSectionObserver.observe(skillsList);
}

// Animate Project Tags
const projectTags = document.querySelectorAll('.tag');
projectTags.forEach((tag, index) => {
    tag.style.opacity = '0';
    tag.style.animation = `fadeIn 0.4s ease ${index * 0.1}s forwards`;
});

// Add hover animation class to buttons
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('mouseenter', function () {
        this.style.animation = 'pulse 0.5s ease';
    });
    button.addEventListener('animationend', function () {
        this.style.animation = '';
    });
});

// Animate Info Grid Items
const infoItems = document.querySelectorAll('.info-item');
const infoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.animation = 'bounceIn 0.6s ease forwards';
                entry.target.style.opacity = '1';
            }, index * 150);
            infoObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
infoItems.forEach(item => {
    item.style.opacity = '0';
    infoObserver.observe(item);
});

// Add floating animation to profile image
const profileImg = document.querySelector('.profile-img');
if (profileImg) {
    profileImg.style.animation = 'float 6s ease-in-out infinite';
}

// Animate social links on scroll
const socialLinks = document.querySelectorAll('.social-link');
const socialObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.animation = 'bounceIn 0.5s ease forwards';
                entry.target.style.opacity = '1';
            }, index * 100);
            socialObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
socialLinks.forEach(link => {
    link.style.opacity = '0';
    socialObserver.observe(link);
});

// ==========================================
// CONTACT FORM LOGIC (FORMSPREE)
// ==========================================
async function handleFormSubmit(event) {
    event.preventDefault();

    // --- IMPORTANT: FORMSPREE ID ---
    const formId = "mblnazzw";
    // -------------------------------

    const btn = document.getElementById('formBtn');
    const status = document.getElementById('formStatus');

    const form = event.target;
    const data = new FormData(form);

    // Button Loading State
    const originalBtnContent = btn.innerHTML;
    btn.innerHTML = 'Sending...';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    try {
        const response = await fetch(`https://formspree.io/f/${formId}`, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            // Success
            btn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
            btn.style.background = '#00c853';
            btn.style.color = 'white';
            status.innerHTML = "Thanks! I'll get back to you soon.";
            status.style.color = "#00c853";
            form.reset();

            setTimeout(() => {
                btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                btn.style.background = 'var(--accent-primary)';
                btn.style.color = '#000';
                btn.style.opacity = '1';
                btn.disabled = false;
                status.innerHTML = "";
            }, 4000);
        } else {
            // Error
            const jsonData = await response.json();
            throw new Error(jsonData.error || "Submission failed");
        }
    } catch (error) {
        console.error(error);
        btn.innerHTML = 'Error <i class="fas fa-times"></i>';
        btn.style.background = '#d32f2f';
        status.innerHTML = "Oops! Something went wrong. Please try again.";
        status.style.color = "#d32f2f";

        setTimeout(() => {
            btn.innerHTML = 'Try Again <i class="fas fa-paper-plane"></i>';
            btn.style.background = 'var(--accent-primary)';
            btn.disabled = false;
        }, 3000);
    }
}

// ==========================================
// RESEARCH ABSTRACT MODAL
// ==========================================
function viewResearchAbstract() {
    const modal = document.getElementById('researchModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeResearchModal() {
    const modal = document.getElementById('researchModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside of it
document.addEventListener('click', (e) => {
    const modal = document.getElementById('researchModal');
    if (modal && e.target === modal) {
        closeResearchModal();
    }
});

// ==========================================
// FUTURISTIC ENHANCEMENTS
// ==========================================

// Feature 1: Ripple Click Effects
function createRipple(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// Add ripple to all interactive elements
const rippleElements = document.querySelectorAll('.btn, .project-card, .skill-item, .contact-card, .research-card, .keyword, .research-btn, .tag');
rippleElements.forEach(el => {
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.addEventListener('click', createRipple);
});

// Feature 2: Text Glitch Effects - DISABLED
/*
function initGlitchEffect() {
    const titles = document.querySelectorAll('.section-title');

    titles.forEach(title => {
        // Add data-text attribute
        title.setAttribute('data-text', title.textContent);

        // Trigger glitch on scroll into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.glitched) {
                    entry.target.classList.add('glitch');
                    entry.target.dataset.glitched = 'true';

                    setTimeout(() => {
                        entry.target.classList.remove('glitch');
                    }, 800);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(title);

        // Also trigger on hover
        title.addEventListener('mouseenter', function () {
            if (!this.classList.contains('glitch')) {
                this.classList.add('glitch');
                setTimeout(() => this.classList.remove('glitch'), 600);
            }
        });
    });
}

// Initialize glitch after DOM load
document.addEventListener('DOMContentLoaded', initGlitchEffect);
*/

// Feature 3: Parallax Layers
function handleParallax() {
    const scrolled = window.pageYOffset;

    const layers = [
        { element: document.querySelector('.bg-grid'), speed: 0.5 },
        { element: document.querySelector('.bg-orbs'), speed: 0.3 },
        { element: document.getElementById('three-canvas'), speed: 0.2 },
        { element: document.querySelector('.scan-lines'), speed: 0.6 }
    ];

    layers.forEach(layer => {
        if (layer.element) {
            const yPos = -(scrolled * layer.speed);
            layer.element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        }
    });
}

// Throttled parallax scroll
let parallaxTicking = false;
window.addEventListener('scroll', () => {
    if (!parallaxTicking) {
        window.requestAnimationFrame(() => {
            handleParallax();
            parallaxTicking = false;
        });
        parallaxTicking = true;
    }
});

// Feature 4: Holographic Card Effects
function addHolographicEffect() {
    const cards = document.querySelectorAll('.project-card, .skill-item, .contact-card, .research-card, .info-item');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const percentX = (x - centerX) / centerX;
            const percentY = (y - centerY) / centerY;

            const bgX = 50 + (percentX * 50);
            const bgY = 50 + (percentY * 50);

            card.style.setProperty('--hologram-x', `${bgX}%`);
            card.style.setProperty('--hologram-y', `${bgY}%`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--hologram-x', '50%');
            card.style.setProperty('--hologram-y', '50%');
        });
    });
}

// Initialize holographic effect
addHolographicEffect();

// Feature 5: 3D Flip Cards for Projects
function initializeFlipCards() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        card.addEventListener('click', function (e) {
            // Prevent flip if clicking on a link
            if (e.target.tagName === 'A') return;

            this.classList.toggle('flipped');
        });
    });
}

// Initialize flip cards on load
document.addEventListener('DOMContentLoaded', initializeFlipCards);