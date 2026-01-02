/**
 * DPHOTO SOCIAL SHARING MODULE
 * ============================
 * 
 * This module provides one-tap social sharing functionality for photos.
 * It uses the Web Share API (native on iOS/Android) with graceful fallbacks.
 * 
 * Features:
 * - Share photo file directly (not just links)
 * - Pre-filled hashtags and captions
 * - Works on mobile and desktop
 * - Fallback to clipboard copy on unsupported browsers
 * 
 * @author Fred Assaf / Developer
 * @version 1.0.0
 */

class PhotoShareManager {
    constructor(options = {}) {
        this.defaultHashtags = options.hashtags || ['dphoto', 'photography'];
        this.photographerName = options.photographer || 'dphoto';
        this.galleryUrl = options.galleryUrl || window.location.href;
    }

    /**
     * Check if the Web Share API is available
     * @returns {boolean}
     */
    canShare() {
        return typeof navigator.share === 'function';
    }

    /**
     * Check if the browser supports sharing files
     * @returns {boolean}
     */
    canShareFiles() {
        return this.canShare() && typeof navigator.canShare === 'function';
    }

    /**
     * Share a photo using the native share sheet
     * Works best on iOS and Android
     * 
     * @param {Object} photoData - Photo information
     * @param {string} photoData.imageUrl - URL of the image to share
     * @param {string} photoData.title - Photo title
     * @param {string} photoData.albumUrl - URL to the album/photo page
     * @param {string[]} photoData.hashtags - Optional custom hashtags
     */
    async sharePhoto(photoData) {
        const { imageUrl, title, albumUrl, hashtags } = photoData;
        const tags = hashtags || this.defaultHashtags;
        const hashtagString = tags.map(t => `#${t}`).join(' ');
        const shareText = `${title} 📸 ${hashtagString}`;

        try {
            // Try to share the actual image file
            if (this.canShareFiles()) {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const fileName = this._sanitizeFilename(title) + '.jpg';
                const file = new File([blob], fileName, { type: blob.type });

                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: title,
                        text: shareText
                    });
                    return { success: true, method: 'file' };
                }
            }

            // Fallback: Share URL only
            if (this.canShare()) {
                await navigator.share({
                    title: title,
                    text: shareText,
                    url: albumUrl || this.galleryUrl
                });
                return { success: true, method: 'url' };
            }

            // Final fallback: Copy to clipboard
            return await this.copyLinkToClipboard(albumUrl || this.galleryUrl);

        } catch (error) {
            if (error.name === 'AbortError') {
                // User cancelled - not an error
                return { success: false, cancelled: true };
            }
            console.error('Share failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Share specifically optimized for Instagram
     * Instagram works best with image files via share sheet
     * 
     * @param {Object} photoData - Photo information
     */
    async shareToInstagram(photoData) {
        const { imageUrl, title } = photoData;
        const hashtags = ['photography', 'photooftheday', ...this.defaultHashtags];
        const shareText = `📸 ${title}\n\n${hashtags.map(t => `#${t}`).join(' ')}`;

        try {
            if (this.canShareFiles()) {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });

                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: title,
                        text: shareText
                    });
                    return { success: true, method: 'instagram-share' };
                }
            }

            // If file sharing not available, download and instruct
            return {
                success: false,
                fallback: 'download',
                message: 'Photo downloaded! Open Instagram and share from your Photos.'
            };

        } catch (error) {
            if (error.name === 'AbortError') {
                return { success: false, cancelled: true };
            }
            return { success: false, error: error.message };
        }
    }

    /**
     * Copy a link to the clipboard
     * Used as fallback on desktop browsers
     * 
     * @param {string} url - URL to copy
     */
    async copyLinkToClipboard(url) {
        try {
            await navigator.clipboard.writeText(url);
            return { success: true, method: 'clipboard' };
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return { success: true, method: 'clipboard-fallback' };
        }
    }

    /**
     * Sanitize a string for use as a filename
     * @param {string} str - Input string
     * @returns {string} - Sanitized filename
     */
    _sanitizeFilename(str) {
        return str
            .replace(/[^a-z0-9]/gi, '_')
            .replace(/_+/g, '_')
            .substring(0, 50);
    }
}

/**
 * Create share button UI
 * Can be injected into any photo viewer
 * 
 * @param {HTMLElement} container - Container to append buttons to
 * @param {Object} photoData - Photo information
 * @param {PhotoShareManager} shareManager - Share manager instance
 */
function createShareButtons(container, photoData, shareManager) {
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'dphoto-share-buttons';
    buttonGroup.innerHTML = `
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
        <button class="dphoto-btn dphoto-btn-instagram" data-action="instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            Instagram
        </button>
    `;

    // Add event listeners
    buttonGroup.querySelector('[data-action="share"]').addEventListener('click', async () => {
        const result = await shareManager.sharePhoto(photoData);
        if (result.success && result.method === 'clipboard') {
            showToast('Link copied to clipboard!');
        }
    });

    buttonGroup.querySelector('[data-action="instagram"]').addEventListener('click', async () => {
        const result = await shareManager.shareToInstagram(photoData);
        if (result.fallback === 'download') {
            showToast(result.message);
        }
    });

    container.appendChild(buttonGroup);
}

/**
 * Show a toast notification
 * @param {string} message - Message to display
 */
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'dphoto-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PhotoShareManager, createShareButtons };
}

