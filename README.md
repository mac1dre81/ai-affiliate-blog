# AI Affiliate Blog

A modern blog platform with AI-powered content generation and affiliate marketing features.

## Features

- 🚀 Next.js 14 with App Router
- ✨ AI-powered content generation using OpenAI
- 📝 Rich text editor with markdown support
- 🔍 SEO optimized blog posts
- 🏷️ Tagging and categorization
- 🔗 Affiliate link management
- 🌓 Light/Dark mode (coming soon)
- 🔐 Authentication (coming soon)

## Prerequisites

- Node.js 18+
- MongoDB (local or cloud)
- OpenAI API key

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-affiliate-blog.git
   cd ai-affiliate-blog
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Update the values in `.env.local` with your configuration

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Database
DATABASE_URL=mongodb://localhost:27017/ai-blog
DATABASE_NAME=ai-blog

# Application
NODE_ENV=development
SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/                    # App Router
│   ├── api/                # API routes
│   │   ├── ai/             # AI generation endpoints
│   │   └── posts/          # Blog post endpoints
│   └── (other pages)       # Application pages
├── components/             # Reusable components
├── lib/                    # Utility functions
├── models/                 # Database models
└── styles/                 # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
