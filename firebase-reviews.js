import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCYat9lRYRHkUqgxWEB48GvvN0Jfaw5NXk",
  authDomain: "leoclub-reviews.firebaseapp.com",
  projectId: "leoclub-reviews",
  storageBucket: "leoclub-reviews.firebasestorage.app",
  messagingSenderId: "524398606853",
  appId: "1:524398606853:web:c6106f1442aefa9a493a6c",
  measurementId: "G-1M79ZTQPXE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to generate initials from a name
function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

// Function to render a single review
function renderReview(reviewData, isNew = false) {
    const container = document.getElementById("reviewsContainer");
    
    // Choose color based on name length to add some variety
    const isMaroon = reviewData.name.length % 2 === 0;
    const bgColor = isMaroon ? 'bg-maroon/20' : 'bg-gold/20';
    const textColor = isMaroon ? 'text-maroon' : 'text-gold';
    const borderColor = isMaroon ? 'hover:border-maroon/30' : 'hover:border-gold/30';
    const quoteColor = isMaroon ? 'text-maroon/10' : 'text-gold/10';

    const reviewHTML = `
        <div class="bg-darkSurface p-10 rounded-3xl border border-gray-800 relative reveal active group ${borderColor} transition-all">
            <i class="fas fa-quote-right absolute top-8 right-10 text-6xl ${quoteColor}"></i>
            <p class="text-gray-300 text-lg italic mb-8 leading-relaxed">
                "${reviewData.review}"
            </p>
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full ${bgColor} flex items-center justify-center ${textColor} font-bold">
                    ${getInitials(reviewData.name)}
                </div>
                <div>
                    <p class="text-white font-bold">${reviewData.name}</p>
                    <p class="text-gray-500 text-xs">${reviewData.role}</p>
                </div>
            </div>
        </div>
    `;

    if (isNew) {
        container.insertAdjacentHTML('afterbegin', reviewHTML);
    } else {
        container.insertAdjacentHTML('beforeend', reviewHTML);
    }
}

// Fetch existing reviews on load
async function loadReviews() {
    const container = document.getElementById("reviewsContainer");
    try {
        const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            container.innerHTML = ''; // Clear existing static reviews
            querySnapshot.forEach((doc) => {
                renderReview(doc.data(), false);
            });
        }
    } catch (error) {
        console.error("Error loading reviews: ", error);
        // If there's an error (e.g. permission denied or missing index), we just leave the static reviews as fallback.
    }
}

// Handle Form Submission
document.addEventListener("DOMContentLoaded", () => {
    loadReviews();

    const reviewForm = document.getElementById("reviewForm");
    if (reviewForm) {
        reviewForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // Stop page reload
            
            const submitBtn = reviewForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;

            const formData = new FormData(reviewForm);
            const reviewData = {
                name: formData.get("Name"),
                role: formData.get("Role"),
                rating: parseInt(formData.get("Rating")) || 5,
                review: formData.get("Review"),
                createdAt: new Date().toISOString()
            };

            try {
                // Save to Firestore
                await addDoc(collection(db, "reviews"), reviewData);
                
                // Show on screen immediately
                renderReview(reviewData, true);

                // Show success banner
                const successBanner = document.getElementById("reviewSuccessBanner");
                if (successBanner) {
                    successBanner.classList.remove('hidden');
                }

                // Close modal and reset form
                if (typeof window.closeReviewModal === 'function') {
                    window.closeReviewModal();
                }
                reviewForm.reset();
                
                // Reset stars visually
                const stars = document.querySelectorAll('#starRating i');
                if (stars) {
                    stars.forEach(star => {
                        star.classList.remove('text-gray-600');
                        star.classList.add('text-gold');
                    });
                }
                
                // Hide success banner after 5 seconds
                setTimeout(() => {
                    if (successBanner) successBanner.classList.add('hidden');
                }, 5000);

            } catch (error) {
                console.error("Error adding review: ", error);
                alert("Failed to submit review. Please check console for details.");
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});
