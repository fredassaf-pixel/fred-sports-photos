/**
 * DPHOTO LIGHTBOX MODULE
 * ======================
 * 
 * A modern, gesture-enabled photo lightbox viewer.
 * 
 * Features:
 * - Smooth open/close animations
 * - Swipe gestures (mobile)
 * - Keyboard navigation (desktop)
 * - Pinch-to-zoom
 * - Photo counter overlay
 * - Integrated share/download buttons
 * 
 * @author Fred Assaf / Developer
 * @version 1.0.0
 */

class PhotoLightbox {
    constructor(options = {}) {
        this.photos = options.photos || [];
        this.currentIndex = 0;
        this.isOpen = false;
        this.onShare = options.onShare || null;
        this.onDownload = options.onDownload || null;
        
        this._createLightbox();
        this._bindEvents();
    }

    /**
     * Create the lightbox DOM elements
     */
    _createLightbox() {
        // Main container
        this.container = document.createElement('div');
        this.container.className = 'dphoto-lightbox';
        this.container.innerHTML = `
            <div class="dphoto-lightbox-overlay"></div>
            <div class="dphoto-lightbox-content">
                <img class="dphoto-lightbox-image" src="" alt="">
                <div class="dphoto-lightbox-loader">
                    <div class="spinner"></div>
                </div>
            </div>
            <button class="dphoto-lightbox-close" aria-label="Close">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
            <button class="dphoto-lightbox-nav dphoto-lightbox-prev" aria-label="Previous">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"/>
                </svg>
            </button>
            <button class="dphoto-lightbox-nav dphoto-lightbox-next" aria-label="Next">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"/>
                </svg>
            </button>
            <div class="dphoto-lightbox-info">
                <span class="dphoto-lightbox-counter">1 / 1</span>
                <span class="dphoto-lightbox-title"></span>
            </div>
            <div class="dphoto-lightbox-actions">
                <button class="dphoto-btn dphoto-btn-download" data-action="download">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Save
                </button>
                <button class="dphoto-btn dphoto-btn-share" data-action="share">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="18" cy="5" r="3"/>
                        <circle cx="6" cy="12" r="3"/>
                        <circle cx="18" cy="19" r="3"/>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                    Share
                </button>
            </div>
        `;
        
        document.body.appendChild(this.container);
        
        // Cache elements
        this.overlay = this.container.querySelector('.dphoto-lightbox-overlay');
        this.image = this.container.querySelector('.dphoto-lightbox-image');
        this.loader = this.container.querySelector('.dphoto-lightbox-loader');
        this.counter = this.container.querySelector('.dphoto-lightbox-counter');
        this.title = this.container.querySelector('.dphoto-lightbox-title');
        this.closeBtn = this.container.querySelector('.dphoto-lightbox-close');
        this.prevBtn = this.container.querySelector('.dphoto-lightbox-prev');
        this.nextBtn = this.container.querySelector('.dphoto-lightbox-next');
        this.downloadBtn = this.container.querySelector('[data-action="download"]');
        this.shareBtn = this.container.querySelector('[data-action="share"]');
    }

    /**
     * Bind event listeners
     */
    _bindEvents() {
        // Close button
        this.closeBtn.addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', () => this.close());
        
        // Navigation
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            switch (e.key) {
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowLeft':
                    this.prev();
                    break;
                case 'ArrowRight':
                    this.next();
                    break;
            }
        });
        
        // Touch swipe
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
        });
        
        // Action buttons
        this.downloadBtn.addEventListener('click', () => {
            if (this.onDownload) {
                this.onDownload(this.photos[this.currentIndex]);
            }
        });
        
        this.shareBtn.addEventListener('click', () => {
            if (this.onShare) {
                this.onShare(this.photos[this.currentIndex]);
            }
        });
    }

    /**
     * Open the lightbox with a specific photo
     * @param {number} index - Index of photo to show
     */
    open(index = 0) {
        this.currentIndex = index;
        this.isOpen = true;
        this.container.classList.add('active');
        document.body.style.overflow = 'hidden';
        this._loadImage();
    }

    /**
     * Close the lightbox
     */
    close() {
        this.isOpen = false;
        this.container.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * Go to previous photo
     */
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this._loadImage();
        }
    }

    /**
     * Go to next photo
     */
    next() {
        if (this.currentIndex < this.photos.length - 1) {
            this.currentIndex++;
            this._loadImage();
        }
    }

    /**
     * Load the current photo
     */
    _loadImage() {
        const photo = this.photos[this.currentIndex];
        if (!photo) return;
        
        // Show loader
        this.loader.classList.add('active');
        this.image.style.opacity = '0';
        
        // Update info
        this.counter.textContent = `${this.currentIndex + 1} / ${this.photos.length}`;
        this.title.textContent = photo.title || '';
        
        // Update nav visibility
        this.prevBtn.style.display = this.currentIndex === 0 ? 'none' : 'flex';
        this.nextBtn.style.display = this.currentIndex === this.photos.length - 1 ? 'none' : 'flex';
        
        // Load image
        const img = new Image();
        img.onload = () => {
            this.image.src = photo.imageUrl;
            this.image.alt = photo.title || '';
            this.loader.classList.remove('active');
            this.image.style.opacity = '1';
        };
        img.onerror = () => {
            this.loader.classList.remove('active');
            console.error('Failed to load image:', photo.imageUrl);
        };
        img.src = photo.imageUrl;
    }

    /**
     * Update the photos array
     * @param {Array} photos - Array of photo objects
     */
    setPhotos(photos) {
        this.photos = photos;
    }

    /**
     * Destroy the lightbox
     */
    destroy() {
        this.container.remove();
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PhotoLightbox };
}

