// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Navigation highlight on scroll
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
});

// Parallax effect for hero section
const heroContent = document.querySelector('.hero-content');
const heroSection = document.querySelector('.hero');

window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    if (scroll <= heroSection.clientHeight) {
        heroContent.style.transform = `translateY(${scroll * 0.5}px)`;
        heroContent.style.opacity = 1 - (scroll / heroSection.clientHeight);
    }
});

// Gallery drag functionality
const galleryContainer = document.querySelector('.gallery-container');
const galleryTrack = document.querySelector('.gallery-track');
const galleryItems = document.querySelectorAll('.gallery-item');

let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;
let currentIndex = 0;
let itemWidth = 520; // Width + gap

function setPositionByIndex() {
    currentTranslate = currentIndex * -itemWidth;
    prevTranslate = currentTranslate;
    setSliderPosition();
    updateActiveStates();
}

function updateActiveStates() {
    galleryItems.forEach((item, index) => {
        const distance = Math.abs(index - currentIndex);
        const isActive = index === currentIndex;
        
        item.classList.toggle('active', isActive);
        item.style.setProperty('--shift', Math.sign(index - currentIndex));
        
        const inner = item.querySelector('.gallery-item-inner');
        const shadow = item.querySelector('.gallery-item-shadow');
        
        if (isActive) {
            inner.style.transform = `scale(1) translateY(0) translateZ(50px)`;
            inner.style.opacity = 1;
            shadow.style.opacity = 1;
            shadow.style.transform = `scale(0.9) translateZ(-50px)`;
        } else {
            const scale = Math.max(0.7 - (distance * 0.1), 0.4);
            const translateY = distance * 5;
            const translateZ = -distance * 50;
            const opacity = Math.max(0.5 - (distance * 0.1), 0.2);
            
            inner.style.transform = `scale(${scale}) translateY(${translateY}px) translateZ(${translateZ}px)`;
            inner.style.opacity = opacity;
            shadow.style.opacity = opacity * 0.5;
            shadow.style.transform = `scale(${scale * 0.9}) translateZ(${translateZ - 50}px)`;
        }
    });
}

function setSliderPosition() {
    galleryTrack.style.transform = `translateX(${currentTranslate}px)`;
}

function animation() {
    setSliderPosition();
    if (isDragging) requestAnimationFrame(animation);
}

function touchStart(event) {
    isDragging = true;
    startPos = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    animationID = requestAnimationFrame(animation);
    galleryContainer.style.cursor = 'grabbing';
    
    galleryTrack.style.transition = 'none';
    galleryItems.forEach(item => {
        const inner = item.querySelector('.gallery-item-inner');
        const shadow = item.querySelector('.gallery-item-shadow');
        inner.style.transition = 'none';
        shadow.style.transition = 'none';
    });
}

function touchMove(event) {
    if (!isDragging) return;
    
    const currentPosition = event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    const diff = currentPosition - startPos;
    currentTranslate = prevTranslate + diff;
    
    // Add resistance at edges
    if (currentTranslate > 0) {
        currentTranslate = currentTranslate * 0.3;
    } else if (currentTranslate < -(itemWidth * (galleryItems.length - 1))) {
        const overScroll = currentTranslate + (itemWidth * (galleryItems.length - 1));
        currentTranslate = -(itemWidth * (galleryItems.length - 1)) + (overScroll * 0.3);
    }
}

function touchEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);
    galleryContainer.style.cursor = 'grab';

    galleryTrack.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    galleryItems.forEach(item => {
        const inner = item.querySelector('.gallery-item-inner');
        const shadow = item.querySelector('.gallery-item-shadow');
        inner.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        shadow.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    const movedBy = currentTranslate - prevTranslate;
    
    if (Math.abs(movedBy) > itemWidth / 3) {
        if (movedBy < 0 && currentIndex < galleryItems.length - 1) {
            currentIndex++;
        } else if (movedBy > 0 && currentIndex > 0) {
            currentIndex--;
        }
    }
    
    setPositionByIndex();
}

// Event Listeners
galleryContainer.addEventListener('mousedown', touchStart);
galleryContainer.addEventListener('touchstart', touchStart);

galleryContainer.addEventListener('mousemove', touchMove);
galleryContainer.addEventListener('touchmove', touchMove);

galleryContainer.addEventListener('mouseup', touchEnd);
galleryContainer.addEventListener('touchend', touchEnd);
galleryContainer.addEventListener('mouseleave', touchEnd);

galleryContainer.addEventListener('contextmenu', e => e.preventDefault());

// Initialize gallery position
window.addEventListener('resize', () => {
    itemWidth = window.innerWidth <= 768 ? 315 : 520; // Adjust for mobile
    setPositionByIndex();
});

// Initial setup
setPositionByIndex();

// Enhanced 3D effect with mouse movement
galleryContainer.addEventListener('mousemove', (e) => {
    if (isDragging) return;
    
    const activeItem = document.querySelector('.gallery-item.active');
    if (!activeItem) return;
    
    const rect = galleryContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const moveX = (x - centerX) / centerX * 15;
    const moveY = (y - centerY) / centerY * 10;
    const rotateX = (centerY - y) / centerY * 5;
    const rotateY = (x - centerX) / centerX * 5;
    
    const inner = activeItem.querySelector('.gallery-item-inner');
    const shadow = activeItem.querySelector('.gallery-item-shadow');
    
    inner.style.transform = `
        scale(1) 
        translate3d(${moveX}px, ${moveY}px, 50px)
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg)
    `;
    
    shadow.style.transform = `
        scale(0.9)
        translate3d(${moveX * 1.2}px, ${moveY * 1.2 + 20}px, -50px)
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg)
    `;
});

galleryContainer.addEventListener('mouseleave', () => {
    const activeItem = document.querySelector('.gallery-item.active');
    if (activeItem) {
        const inner = activeItem.querySelector('.gallery-item-inner');
        const shadow = activeItem.querySelector('.gallery-item-shadow');
        
        inner.style.transform = 'scale(1) translate3d(0, 0, 50px) rotateX(0) rotateY(0)';
        shadow.style.transform = 'scale(0.9) translate3d(0, 20px, -50px) rotateX(0) rotateY(0)';
    }
});

// Gallery image hover effect
const galleryItemsHover = document.querySelectorAll('.gallery-item');

galleryItemsHover.forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xPercent = (x / rect.width - 0.5) * 20;
        const yPercent = (y / rect.height - 0.5) * 20;
        
        item.style.transform = `perspective(1000px) rotateX(${yPercent}deg) rotateY(${xPercent}deg)`;
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// FAQ functionality
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // Close other open items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current item
        item.classList.toggle('active');
    });
});

// Create particle effect in hero background
const createParticles = () => {
    const heroSection = document.querySelector('.hero');
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random size
        const size = Math.random() * 3 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random animation duration
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        particlesContainer.appendChild(particle);
    }
    
    heroSection.appendChild(particlesContainer);
};

// Initialize particles
createParticles();

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
