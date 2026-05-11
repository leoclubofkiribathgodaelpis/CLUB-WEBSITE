// Mobile Menu Toggle
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// Project Filtering Logic
function filterProjects(category) {
    const cards = document.querySelectorAll('.project-card');
    const buttons = document.querySelectorAll('.filter-btn');

    // Update buttons
    buttons.forEach(btn => {
        if (btn.innerText.toLowerCase() === category.toLowerCase() || (category === 'all' && btn.innerText === 'All')) {
            btn.classList.add('active', 'bg-maroon', 'text-white');
            btn.classList.remove('bg-dark', 'text-gray-300');
        } else {
            btn.classList.remove('active', 'bg-maroon', 'text-white');
            btn.classList.add('bg-dark', 'text-gray-300');
        }
    });

    // Filter cards
    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 10);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Scroll Reveal Animation
function reveal() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);

// Trigger reveal on load
document.addEventListener("DOMContentLoaded", () => {
    reveal();

    // --- Review Modal & Star Rating Logic ---
    const stars = document.querySelectorAll('#starRating i');
    const ratingInput = document.getElementById('ratingInput');

    if (stars.length > 0) {
        // Default to 5 stars
        updateStars(5);

        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                const rating = parseInt(e.target.getAttribute('data-rating'));
                ratingInput.value = rating;
                updateStars(rating);
            });
        });
    }

    function updateStars(rating) {
        stars.forEach(star => {
            const starRating = parseInt(star.getAttribute('data-rating'));
            if (starRating <= rating) {
                star.classList.remove('text-gray-600');
                star.classList.add('text-gold');
            } else {
                star.classList.remove('text-gold');
                star.classList.add('text-gray-600');
            }
        });
    }

    // Check for review success URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('review_sent') === 'true') {
        const successBanner = document.getElementById('reviewSuccessBanner');
        if (successBanner) {
            successBanner.classList.remove('hidden');
            // Remove the parameter from URL to keep it clean
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
});

// Review Modal Functions
function openReviewModal() {
    const modal = document.getElementById('reviewModal');
    if(modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.querySelector('div').classList.remove('scale-95');
        }, 10);
    }
}

function closeReviewModal() {
    const modal = document.getElementById('reviewModal');
    if(modal) {
        modal.classList.add('opacity-0');
        modal.querySelector('div').classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 300);
    }
}
