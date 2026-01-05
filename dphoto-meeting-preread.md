# dphoto Integration Pre-Read
## Fred Assaf Photography - Custom Landing Page Integration

**Prepared for:** dphoto Team  
**From:** Fred Assaf (fredassaf.org)  
**Date:** January 2025  
**Purpose:** Discuss integration options for custom landing page with dphoto backend

---

## Executive Summary

I've developed a custom landing page for my photography website (fredassaf.org) that provides an enhanced user experience while continuing to use dphoto as my photo hosting and gallery management platform. I'm reaching out to explore integration possibilities that would allow these two systems to work together seamlessly.

**Live Demo:** https://improve-photos-website.vercel.app  
**Current dphoto Gallery:** https://www.fredassaf.org

---

## What I've Built

### Custom Landing Page Features

1. **Immersive Hero Slideshow**
   - Full-screen rotating photos with Ken Burns effect
   - Smooth crossfade transitions
   - Mobile-optimized layout

2. **Featured Albums Section**
   - Curated album highlights with thumbnails
   - Links directly to dphoto album pages
   - Category-based organization (Sports, Performances, School Events)

3. **Enhanced Mobile Experience**
   - Touch-friendly navigation
   - Optimized for phones and tablets
   - Fast loading with optimized images

4. **Branding Integration**
   - Custom logo and typography
   - Pace Academy color scheme
   - Professional, cohesive design

### Current Workflow (Manual)

Currently, I manually:
- Copy album URLs from dphoto to my landing page
- Download/screenshot thumbnails for featured albums
- Update album titles, dates, and photo counts by hand
- Cannot automatically categorize or filter albums

**This is where I need your help.**

---

## Integration Questions

### 1. API Access

**Question:** Does dphoto provide an API for accessing gallery and album data?

If yes, I would need endpoints for:

| Data Needed | Use Case |
|-------------|----------|
| List of all albums | Display album grid on landing page |
| Album metadata (title, date, photo count) | Show album information |
| Album thumbnail/cover image URL | Display album previews |
| Individual photo URLs | Hero slideshow, featured images |
| Album creation/modification dates | Sort by "recently updated" |

**Specific API questions:**
- Is there a REST API or GraphQL endpoint?
- What authentication is required (API key, OAuth)?
- Are there rate limits?
- Is there documentation available?
- Can I access public album data without authentication?

---

### 2. Album Categorization / Tagging

**Question:** Can albums be tagged or categorized within dphoto?

**My need:** I want to organize albums into categories like:
- Sports (Football, Basketball, Volleyball, etc.)
- Performances (Concerts, Theater, Dance)
- School Events (Pep Rallies, Graduation, Ceremonies)
- Fine Arts (Art Shows, Orchestra)

**Ideal solution:**
- Add custom tags/categories to albums in dphoto admin
- Query albums by category via API
- Display filtered results on my landing page

**Alternative approaches I'd consider:**
- Custom metadata fields on albums
- Album naming conventions that I parse
- A separate tagging system that syncs with dphoto album IDs

---

### 3. Thumbnail/Cover Image Access

**Question:** How can I programmatically access album cover images?

**Current challenge:** 
- Album thumbnails use signed URLs that expire
- I cannot hotlink directly to dphoto images
- I currently screenshot thumbnails manually

**What I need:**
- Permanent (non-expiring) URLs for album thumbnails
- Or an API endpoint that returns current thumbnail URLs
- Ideally multiple sizes (small thumbnail, medium, large)

---

### 4. Custom CSS/JavaScript Injection

**Question:** What customization options exist within dphoto itself?

**Things I'd love to add to the dphoto gallery pages:**

1. **Enhanced sharing buttons**
   - One-click share to Instagram
   - Direct download to Apple Photos
   - Copy link button

2. **Custom styling**
   - Match my landing page's look and feel
   - Custom fonts and colors
   - Branded header/footer

3. **Analytics integration**
   - Google Analytics 4 events
   - Track photo views and downloads
   - Conversion tracking

**Questions:**
- Can I inject custom CSS on my gallery?
- Can I add custom JavaScript?
- Is there a "Custom Code" section in settings?
- Can I modify the photo viewer/lightbox?

---

### 5. Embed Options

**Question:** Can dphoto albums be embedded in external pages?

**Use cases:**
- Embed album grid directly on my landing page
- Embed slideshow widget
- Embed individual photos with proper attribution

**What I need to know:**
- Are there embed codes or iframe options?
- Can embeds be styled/customized?
- Do embeds support responsive layouts?
- Can I embed the photo viewer/lightbox?

---

### 6. Webhook / Sync Notifications

**Question:** Can dphoto notify my system when albums are created or updated?

**Use case:** 
When I upload a new album to dphoto, I'd like my landing page to:
- Automatically add it to my album catalog
- Pull the thumbnail and metadata
- Optionally prompt me to categorize it

**Technical options:**
- Webhooks (HTTP callbacks when events occur)
- RSS/Atom feed of recent albums
- Polling an API endpoint periodically

---

### 7. Download & Sharing Features

**Question:** What download and sharing features are available?

**Current dphoto capabilities I use:**
- Photo downloads (individual and bulk)
- Social sharing buttons
- Email sharing

**Enhancements I'd like:**
- Direct "Add to Apple Photos" on mobile
- Instagram share that opens Instagram app with photo
- WhatsApp/iMessage share with preview
- Download entire album as ZIP
- QR code for album sharing

**Questions:**
- Can I customize which sharing options appear?
- Can I add custom share targets?
- Is there a share API I can call from custom code?

---

### 8. SEO & Metadata

**Question:** How can I optimize SEO for my dphoto-hosted galleries?

**Needs:**
- Custom meta titles and descriptions per album
- Open Graph tags for social sharing
- Structured data (JSON-LD) for Google
- Sitemap generation
- Custom canonical URLs

**Questions:**
- Can I edit meta tags for albums?
- Does dphoto generate a sitemap?
- Can I set custom Open Graph images?

---

### 9. Domain & Routing

**Question:** Can I have more control over URL structure?

**Current setup:**
- fredassaf.org → dphoto gallery (DNS mapped)
- Albums at fredassaf.org/album/[id]

**Potential desires:**
- Custom landing page at fredassaf.org (my Vercel page)
- dphoto galleries at fredassaf.org/galleries or /photos
- Or subdomain: photos.fredassaf.org for dphoto

**Questions:**
- Can I change the base path for dphoto?
- Can I set up a subdomain instead?
- How does this affect existing album links?

---

### 10. White-Label / Branding Options

**Question:** What branding customizations are available?

**Current branding I see:**
- "Powered by dphoto" in footer
- dphoto favicon
- Standard dphoto UI elements

**What I'd prefer:**
- Remove or minimize dphoto branding
- Custom favicon
- Custom header with my logo
- Branded loading screens

**Questions:**
- Is white-labeling available?
- What plan level is required?
- Can I customize the favicon?

---

## Technical Details

### My Current Tech Stack

| Component | Technology |
|-----------|------------|
| Landing Page | Static HTML/CSS/JavaScript |
| Hosting | Vercel (free tier) |
| Source Control | GitHub |
| Domain | fredassaf.org (DNS currently points to dphoto) |
| Photo Hosting | dphoto |

### What I Can Build

If dphoto provides the data access, I can build:

1. **Automatic album sync** - Pull new albums nightly
2. **Category management** - Admin interface to tag albums
3. **Search functionality** - Search across all albums
4. **Dynamic filtering** - Filter by sport, year, event type
5. **Photo of the day** - Rotating featured images
6. **Recent activity feed** - "Just added" section
7. **Statistics dashboard** - Photo counts, popular albums

---

## Priority Ranking

If we need to prioritize, here's what matters most to me:

### Must Have (Critical)
1. **API access to album list and metadata** - Without this, I can't automate anything
2. **Stable thumbnail URLs** - Need to display album previews
3. **Album categorization/tagging** - Core feature of my landing page

### Should Have (Important)
4. Custom CSS injection on gallery pages
5. Enhanced sharing buttons (Instagram, Apple Photos)
6. Webhook notifications for new albums

### Nice to Have (Future)
7. Embed widgets
8. White-label branding
9. Advanced SEO controls
10. Subdomain routing

---

## Proposed Next Steps

1. **This Meeting:** Discuss what's currently possible vs. feature requests
2. **Short Term:** Implement any existing features I'm not aware of
3. **Medium Term:** Beta test any new integration features
4. **Long Term:** Ongoing partnership for photography platform improvements

---

## Questions for dphoto

### Quick Yes/No Questions

1. Do you have a public API? [ ] Yes [ ] No [ ] Planned
2. Can albums be tagged/categorized? [ ] Yes [ ] No [ ] Planned
3. Can I inject custom CSS? [ ] Yes [ ] No [ ] Planned
4. Can I inject custom JavaScript? [ ] Yes [ ] No [ ] Planned
5. Are there embed options? [ ] Yes [ ] No [ ] Planned
6. Do you support webhooks? [ ] Yes [ ] No [ ] Planned
7. Is white-labeling available? [ ] Yes [ ] No [ ] Planned

### Open-Ended Questions

1. What integration approach would you recommend for my use case?
2. Are there other photographers doing similar custom landing pages?
3. What's on your product roadmap that might help with this?
4. Would you be open to using my site as a case study/beta test?
5. What's the best way to stay updated on new features?

---

## Appendix: Screenshots

### My Custom Landing Page

**Hero Section:**
- Full-screen photo slideshow
- Smooth transitions and Ken Burns zoom effect
- Mobile-optimized layout

**Featured Albums:**
- Three featured album cards
- Links to dphoto album pages
- Thumbnail, title, date, photo count

**Browse Section:**
- Category filter buttons (currently non-functional)
- Would filter albums by type if API available

### Links

- **Live Demo:** https://improve-photos-website.vercel.app
- **Current dphoto Site:** https://www.fredassaf.org
- **Feature Proposal Code:** Available on request

---

## Contact

**Fred Assaf**  
Pace Academy Photography  
Email: fassaf@paceacademy.org  
Website: fredassaf.org

---

*Thank you for taking the time to review this document. I'm excited to explore how we can make dphoto even better together!*

