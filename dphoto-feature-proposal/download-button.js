/**
 * DPHOTO DOWNLOAD MODULE
 * ======================
 * 
 * This module provides one-tap photo download functionality.
 * Downloads the full-resolution image with a meaningful filename.
 * 
 * Features:
 * - One-click download to device
 * - Meaningful filenames (title + photographer)
 * - Visual feedback on success
 * - Works on all devices
 * 
 * @author Fred Assaf / Developer
 * @version 1.0.0
 */

class PhotoDownloadManager {
    constructor(options = {}) {
        this.photographerName = options.photographer || 'photo';
        this.showConfirmation = options.showConfirmation !== false;
    }

    /**
     * Download a photo to the user's device
     * 
     * @param {Object} photoData - Photo information
     * @param {string} photoData.imageUrl - Full URL to the image
     * @param {string} photoData.title - Photo title
     * @param {string} photoData.album - Album name (optional)
     * @returns {Promise<Object>} - Result of download attempt
     */
    async downloadPhoto(photoData) {
        const { imageUrl, title, album } = photoData;
        
        try {
            // Fetch the image as a blob
            const response = await fetch(imageUrl);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.status}`);
            }
            
            const blob = await response.blob();
            
            // Determine file extension from content type
            const contentType = response.headers.get('content-type') || 'image/jpeg';
            const extension = this._getExtension(contentType);
            
            // Create meaningful filename
            const filename = this._createFilename(title, album, extension);
            
            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            URL.revokeObjectURL(url);
            
            // Show confirmation
            if (this.showConfirmation) {
                this._showConfirmation(filename);
            }
            
            return { 
                success: true, 
                filename: filename,
                size: blob.size 
            };
            
        } catch (error) {
            console.error('Download failed:', error);
            
            // Fallback: Open image in new tab
            window.open(imageUrl, '_blank');
            
            return { 
                success: false, 
                fallback: true,
                error: error.message 
            };
        }
    }

    /**
     * Get file extension from MIME type
     * @param {string} contentType - MIME type
     * @returns {string} - File extension
     */
    _getExtension(contentType) {
        const mimeMap = {
            'image/jpeg': 'jpg',
            'image/jpg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/webp': 'webp',
            'image/heic': 'heic'
        };
        return mimeMap[contentType] || 'jpg';
    }

    /**
     * Create a meaningful filename
     * @param {string} title - Photo title
     * @param {string} album - Album name (optional)
     * @param {string} extension - File extension
     * @returns {string} - Formatted filename
     */
    _createFilename(title, album, extension) {
        let filename = title || 'photo';
        
        // Sanitize
        filename = filename
            .replace(/[^a-z0-9\s]/gi, '')
            .replace(/\s+/g, '-')
            .toLowerCase()
            .substring(0, 50);
        
        // Add photographer name
        if (this.photographerName && this.photographerName !== 'photo') {
            filename += `-${this.photographerName}`;
        }
        
        // Add album if provided
        if (album) {
            const albumClean = album
                .replace(/[^a-z0-9]/gi, '')
                .toLowerCase()
                .substring(0, 20);
            filename += `-${albumClean}`;
        }
        
        return `${filename}.${extension}`;
    }

    /**
     * Show download confirmation toast
     * @param {string} filename - Downloaded filename
     */
    _showConfirmation(filename) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'dphoto-download-toast';
        toast.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>Saved to Photos!</span>
        `;
        
        // Style the toast
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '80px',
            left: '50%',
            transform: 'translateX(-50%) translateY(20px)',
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '16px',
            fontWeight: '500',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            opacity: '0',
            transition: 'all 0.3s ease',
            zIndex: '99999'
        });
        
        document.body.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });
        
        // Remove after delay
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }
}

/**
 * Create download button UI
 * Can be injected into any photo viewer
 * 
 * @param {HTMLElement} container - Container to append button to
 * @param {Object} photoData - Photo information
 * @param {PhotoDownloadManager} downloadManager - Download manager instance
 */
function createDownloadButton(container, photoData, downloadManager) {
    const button = document.createElement('button');
    button.className = 'dphoto-btn dphoto-btn-download';
    button.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Save Photo
    `;
    
    button.addEventListener('click', async () => {
        // Add loading state
        button.classList.add('loading');
        button.innerHTML = `
            <span class="spinner"></span>
            Saving...
        `;
        
        const result = await downloadManager.downloadPhoto(photoData);
        
        // Restore button
        setTimeout(() => {
            button.classList.remove('loading');
            button.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Save Photo
            `;
        }, 500);
        
        if (!result.success && result.fallback) {
            console.log('Download opened in new tab as fallback');
        }
    });
    
    container.appendChild(button);
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PhotoDownloadManager, createDownloadButton };
}

