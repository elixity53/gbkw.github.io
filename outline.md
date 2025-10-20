# Gentle Bear Knifeworks - Project Outline

## File Structure
```
/mnt/okcomputer/output/
├── index.html              # Homepage with hero and portfolio preview
├── about.html              # Maker story and detailed process
├── contact.html            # Custom order form and business info
├── main.js                 # All animations and interactions
├── resources/              # Images and media assets
│   ├── hero-forge.png      # Generated hero background
│   ├── knife-collection.png # Portfolio showcase image
│   ├── maker-portrait.png  # About section portrait
│   └── knife-01.jpg through knife-20.jpg # Portfolio images
├── interaction.md          # Interaction design document
├── design.md              # Visual design guide
└── outline.md             # This project outline
```

## Page Breakdown

### 1. Homepage (index.html)
**Purpose**: Create immediate impact and showcase craftsmanship

**Sections**:
- **Navigation Bar**: Logo, menu items (Home, About, Contact), social links
- **Hero Section**: 
  - Cinematic forge background animation
  - Animated text: "Hand-Forged Precision" + "Gentle Bear Knifeworks"
  - CTA button: "View Our Work"
- **Portfolio Preview**: 
  - 3-column grid of featured knives (6-8 items)
  - Hover effects with 3D rotation and glow
  - Filter tabs: All, Hunting, Chef, Custom
- **Process Overview**:
  - 5-step interactive timeline
  - Scroll-triggered animations
- **Call-to-Action**: "Commission Your Blade" section
- **Footer**: Contact info, social links, copyright

### 2. About Page (about.html)
**Purpose**: Tell the maker's story and showcase expertise

**Sections**:
- **Navigation Bar**: Consistent across all pages
- **Maker Portrait Section**:
  - Generated portrait image
  - Personal story and philosophy
- **Forge Process Deep Dive**:
  - Detailed 5-step process with animations
  - Steel types and material information
  - Handle materials showcase
- **Craftsmanship Philosophy**:
  - Traditional techniques
  - Quality standards
  - Custom approach
- **Equipment & Tools**: Visual showcase of forge setup
- **Contact CTA**: Link to custom orders

### 3. Contact Page (contact.html)
**Purpose**: Facilitate custom orders and provide business information

**Sections**:
- **Navigation Bar**: Consistent design
- **Contact Information**:
  - Jamaal Simpson (owner name)
  - Email: Jamaulsimp@gmail.com
  - Phone: (505) 907-0229
  - Instagram: @Gentle_bear_knifeworks
- **Custom Order Form**:
  - Name, Email, Phone fields
  - Knife Type dropdown
  - Custom Request textarea
  - Submit with animation
- **Process Explanation**: How custom orders work
- **Pricing Information**: General pricing tiers
- **Timeline Expectations**: Lead times and process
- **FAQ Section**: Common questions

## Interactive Components

### 1. Portfolio Gallery System
- **Lightbox Modal**: Full-screen image viewer
- **Filter System**: Category-based filtering
- **Hover Effects**: 3D rotation and glow
- **Lazy Loading**: Performance optimization

### 2. Forge Process Timeline
- **Scroll Animations**: Reveal on scroll
- **Interactive Steps**: Click/hover effects
- **Progress Indicator**: Visual progress tracking
- **Sound Effects**: Optional forge sounds

### 3. Custom Order Form
- **Form Validation**: Real-time validation
- **Character Counter**: For custom requests
- **Success Animation**: Submission feedback
- **Error Handling**: User-friendly errors

### 4. Navigation System
- **Smooth Scrolling**: Between sections
- **Active States**: Current page highlighting
- **Mobile Menu**: Responsive hamburger menu
- **Sticky Header**: On scroll behavior

## Content Requirements

### Images Needed (20+ total)
- **Hero/Background**: 3-4 forge/craftsmanship images
- **Portfolio Knives**: 20 individual knife photos
- **Process Steps**: 5 forge process illustrations
- **Materials**: Steel types, handle materials
- **Workshop**: Tools, equipment, environment
- **Maker**: Portrait and action shots

### Text Content
- **Homepage**: ~800 words across all sections
- **About Page**: ~1200 words (story, process, philosophy)
- **Contact Page**: ~600 words (instructions, FAQ)
- **Knife Descriptions**: 20 individual descriptions (50-100 words each)

## Technical Implementation

### Core Libraries
1. **Anime.js**: Text and element animations
2. **p5.js**: Particle effects and forge fire
3. **Pixi.js**: Advanced visual effects
4. **Splitting.js**: Character-level animations
5. **Typed.js**: Typewriter effects
6. **Splide.js**: Image carousels
7. **ECharts.js**: Data visualizations

### Performance Considerations
- **Image Optimization**: WebP format with fallbacks
- **Lazy Loading**: Above-the-fold priority
- **Animation Performance**: GPU acceleration
- **Mobile Optimization**: Touch-friendly interactions
- **Accessibility**: ARIA labels, keyboard navigation

### Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Chrome Mobile
- **Fallbacks**: Graceful degradation for older browsers
- **Progressive Enhancement**: Core functionality without JavaScript

## Business Integration
- **Contact Information**: Prominently displayed
- **Social Media**: Instagram integration
- **SEO Optimization**: Meta tags, structured data
- **Analytics**: User behavior tracking
- **Performance**: Fast loading times, Core Web Vitals