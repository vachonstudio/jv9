# Vachon UX Design Studio

A modern UX design studio website featuring a portfolio, blog, gradient gallery, and comprehensive authentication system built with Next.js, Supabase, and Tailwind CSS.

## ✨ Features

- **Portfolio Showcase** - Dynamic case studies with public/private access
- **Gradient Gallery** - Interactive collection with favorites and sharing
- **Blog Platform** - Rich content management with role-based publishing
- **Authentication System** - Multi-tier access with role management
- **Demo Mode** - Fully functional without external dependencies
- **Responsive Design** - Optimized for all devices
- **SEO Optimized** - Built-in metadata and performance optimization

## 🚀 Quick Start

### Deploy to Vercel (Recommended)

1. **Import to Vercel**
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect Next.js and configure build settings

2. **Environment Variables (Optional)**
   ```bash
   # For production Supabase integration
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. **Deploy**
   - The app works immediately in demo mode
   - Add Supabase credentials later for production features

### Local Development

1. **Clone and Install**
   ```bash
   git clone <your-repo-url>
   cd vachon-ux-studio
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Optional: Setup Supabase**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

## 📁 Project Structure

```
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   ├── globals.css     # Global styles
│   └── api/            # API routes
├── components/         # React components
├── contexts/          # React contexts
├── lib/              # Utility libraries
├── types/            # TypeScript types
├── styles/           # Additional styles
└── public/           # Static assets
```

## 🔧 Configuration

### Demo Mode (Default)
- No external dependencies required
- Mock authentication and data
- Fully functional for showcasing

### Production Mode (with Supabase)
- Real authentication and database
- Persistent user data and content
- Full admin capabilities

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion
- **Backend**: Supabase (optional)
- **UI Components**: Radix UI, Shadcn/ui
- **Deployment**: Vercel

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run deploy:check # Check deployment readiness
```

## 🔐 Authentication Roles

- **Subscriber**: Access to premium content
- **Editor**: Content creation and editing
- **Admin**: User management and full content control
- **Super Admin**: Complete system access

## 📖 Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Supabase Setup](./docs/SUPABASE_INTEGRATION_GUIDE.md)
- [Production Setup](./docs/PRODUCTION_SETUP.md)

## 🆘 Troubleshooting

### Common Issues

1. **404 on Vercel Deploy**
   - Ensure `/app/page.tsx` exists
   - Check build logs for errors
   - Verify Next.js configuration

2. **Supabase Connection Issues**
   - Verify environment variables
   - Check Supabase project status
   - Review network configuration

3. **Build Failures**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check TypeScript errors

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

Built with ❤️ by Vachon Design Studio