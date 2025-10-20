# Gentle Bear Knifeworks - Design Style Guide

## Design Philosophy

### Visual Language
**Rugged Refinement**: The design embodies the intersection of raw craftsmanship and sophisticated artistry. Every element should feel both primal and polished, like a perfectly forged blade that balances function with beauty.

### Color Palette
**Primary Colors:**
- **Charcoal Black** (#1B1B1B) - Deep forge soot, primary background
- **Burnt Orange** (#D96B2B) - Molten metal glow, accent and hover states
- **Gunmetal Gray** (#2E2E2E) - Subtle metallic tones, secondary backgrounds
- **Warm White** (#F5F3EF) - Clean contrast, text and highlights

**Supporting Colors:**
- **Forge Red** (#B85450) - Deeper accent for intense moments
- **Steel Blue** (#4A5568) - Cool balance for technical sections

### Typography
**Display Font**: Cinzel (serif) - Forged-metal aesthetic, used for headings and brand elements
**Body Font**: Inter (sans-serif) - Clean readability for content and UI elements
**Accent Font**: Bebas Neue - For technical specifications and callouts

### Visual Effects & Animation

#### Background Effects
- **Forge Fire Shader**: Subtle animated background mimicking heat waves and ember glow
- **Smoke Particle System**: Floating particles using p5.js for atmospheric depth
- **Metallic Reflection**: CSS gradients creating steel-like surface effects

#### Text Effects
- **Molten Metal Reveal**: Text appears as if being forged, with orange glow spreading
- **Hammer Strike Animation**: Letters appear with impact-like timing
- **Steel Engraving**: Subtle text-shadow effects creating carved-in-metal appearance

#### Interactive Elements
- **Heating Hover**: Buttons glow and expand with orange forge-light
- **Blade Rotation**: 3D tilt effects on portfolio images
- **Spark Trail**: Cursor leaves brief ember particles on interaction

## Visual Effect Implementation

### Used Libraries & Effects
1. **Anime.js**: Smooth animations for text reveals and element transitions
2. **p5.js**: Particle systems for forge fire and smoke effects
3. **Pixi.js**: Advanced visual effects for background shaders
4. **Splitting.js**: Character-level text animations
5. **Typed.js**: Typewriter effects for hero taglines
6. **Splide.js**: Smooth carousel for knife showcase
7. **ECharts.js**: Data visualization for steel properties comparison

### Animation Principles
- **Forging Timing**: All animations use easing curves that mimic metalworking rhythms
- **Heat-based Transitions**: Color transitions flow from cool grays to warm oranges
- **Impact Feedback**: Interactive elements provide satisfying tactile responses
- **Scroll Choreography**: Content reveals in sequences that tell the crafting story

### Header & Hero Effects
- **Cinematic Forge Scene**: Background video/animation of glowing steel being hammered
- **Layered Parallax**: Multiple depth layers moving at different speeds
- **Ember Particles**: Floating sparks that respond to mouse movement
- **Gradient Overlays**: Subtle color shifts that enhance the metallic atmosphere

### Responsive Design
- **Mobile-First**: Touch-friendly interactions with proper spacing
- **Flexible Grid**: Portfolio adapts from 1 to 4 columns based on screen size
- **Scalable Effects**: Particle counts and animation complexity adjust for performance
- **Accessible Animations**: Respect user preferences for reduced motion

### Brand Integration
- **Logo Treatment**: Embossed steel effect with subtle orange glow
- **Icon Style**: Line-art style with forge-fire accent colors
- **Photography**: High-contrast, dramatic lighting emphasizing texture and craftsmanship
- **Layout Rhythm**: Grid system based on traditional forge tool proportions