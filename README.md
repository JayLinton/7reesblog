# 7rees Portfolio

A minimalist, high-end personal portfolio website designed with a focus on aesthetics, typography, and fluid user experience.

![7rees Preview](https://img.cdn1.vip/i/69414d9a70376_1765887386.webp)

## ✨ Features

- **Minimalist Aesthetic**: Pure white and subtle gradients with high-end typography (Cormorant Garamond & Inter).
- **Dot-Matrix Image Processing**: Unique visual style using CSS mask-image for a retro-digital textured look.
- **Bilingual Support (CN/EN)**: Full site internationalization with persistent state using `localStorage`.
- **Theme Switching**: Seamless transition between light and dark modes with persistent state.
- **Full-Page Smooth Scrolling**: Snap-to-section navigation on the homepage for an immersive storytelling experience.
- **Markdown-Based Articles**: Content-driven blog section with support for:
  - Article pinning (置顶) functionality.
  - Bilingual content within a single `.md` file.
  - Category filtering (Interest / Tech).
- **Responsive Design**: Optimized for mobile, tablet, and desktop including specialized navigation and layout adjustments.
- **Smooth Animations**: Powered by Framer Motion for graceful transitions and interactions.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Content**: [React Markdown](https://github.com/remarkjs/react-markdown)
- **Routing**: [React Router](https://reactrouter.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/JayLinton/7rees-portfolio.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 📖 Adding Content

### Articles
Articles are stored in the `/articles` directory as `.md` files. They use a simple Frontmatter structure:

```markdown
---
id: your-unique-id
titleCN: 中文标题
titleEN: English Title
date: 2024.01.01
category: tech  # interest or tech
pinned: true    # optional
hidden: false   # optional
---

Chinese content here...

[EN_START]

English content here...
```

### Projects & Links
Modify data in `/data/projects.ts` and `/data/links.ts` to update your portfolio and link collections.

## 🎨 Aesthetic Design

The site follows the "Less is More" philosophy:
- **Whitespace**: Generous breathing room to focus on content.
- **Texture**: Dot-matrix overlays on hero images to provide a tactile digital feel.
- **Typography**: Serifs for elegance (Cormorant Garamond) paired with clean sans-serifs for readability (Inter).

## 📄 License

&copy; 2025 7rees. All Rights Reserved. 

Developed by [7rees](http://www.7rees.cc).