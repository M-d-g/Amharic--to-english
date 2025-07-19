# TechSolutions Pro - Company Website

A modern, responsive company website built with HTML5, CSS3, and JavaScript. Features a professional design with smooth animations, mobile responsiveness, and interactive elements.

## Features

### 🎨 Modern Design
- Clean, professional layout
- Gradient backgrounds and modern typography
- Smooth hover effects and animations
- Responsive design for all devices

### 📱 Mobile-First Approach
- Fully responsive design
- Mobile navigation menu
- Touch-friendly interactions
- Optimized for all screen sizes

### ⚡ Interactive Elements
- Smooth scrolling navigation
- Animated statistics counters
- Contact form with validation
- Scroll-triggered animations
- Dynamic notification system

### 🏢 Company Sections
- **Hero Section**: Eye-catching introduction with call-to-action
- **About**: Company information with statistics and features
- **Services**: Detailed service offerings with icons
- **Portfolio**: Showcase of recent projects
- **Contact**: Contact information and functional form
- **Footer**: Links, social media, and company info

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript**: Interactive functionality and form handling
- **Font Awesome**: Professional icons
- **Google Fonts**: Inter font family for modern typography

## Quick Start

1. **Clone or download** the repository
2. **Open** `index.html` in your web browser
3. **Customize** the content for your company

No build process or dependencies required!

## Customization Guide

### 🎨 Colors and Branding
Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #2563eb;    /* Main brand color */
    --primary-dark: #1d4ed8;     /* Darker shade */
    --accent-color: #f59e0b;     /* Accent color */
    /* ... other colors */
}
```

### 📝 Company Information
Update the following in `index.html`:

1. **Company Name**: Change "TechSolutions Pro" throughout the file
2. **Contact Information**: Update phone, email, and address
3. **Services**: Modify the services section with your offerings
4. **About Text**: Update company description and statistics
5. **Portfolio**: Replace with your actual projects

### 🖼️ Images and Graphics
- The site uses Font Awesome icons as placeholders
- Replace icon placeholders with actual images:
  ```html
  <!-- Replace this -->
  <div class="portfolio-placeholder">
      <i class="fas fa-shopping-cart"></i>
  </div>
  
  <!-- With this -->
  <img src="your-image.jpg" alt="Project description">
  ```

### 📧 Contact Form
The contact form currently shows success messages. To make it functional:

1. **Add backend processing** (PHP, Node.js, or form service)
2. **Update form action** in `index.html`
3. **Modify JavaScript** in `script.js` to handle real submissions

Popular form services:
- [Formspree](https://formspree.io/)
- [Netlify Forms](https://www.netlify.com/products/forms/)
- [EmailJS](https://www.emailjs.com/)

## File Structure

```
├── index.html          # Main HTML file
├── styles.css          # All CSS styles
├── script.js           # JavaScript functionality
├── README.md           # This file
└── translate.js        # Legacy file (can be removed)
```

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## Performance Features

- **Optimized CSS**: Efficient selectors and minimal reflow
- **Debounced scroll events**: Improved performance
- **Intersection Observer**: Efficient scroll animations
- **Lazy loading ready**: For images when added

## SEO Ready

- Semantic HTML structure
- Meta tags for viewport and charset
- Proper heading hierarchy
- Alt text ready for images

## Deployment

### GitHub Pages
1. Push code to GitHub repository
2. Go to Settings > Pages
3. Select source branch
4. Your site will be available at `https://yourusername.github.io/repository-name`

### Netlify
1. Drag and drop the folder to [Netlify](https://netlify.com)
2. Your site will be deployed instantly

### Traditional Hosting
Upload all files to your web server's public directory.

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or support, please contact [your-email@company.com](mailto:your-email@company.com).

---

Built with ❤️ for modern businesses