# 🎯 SkillLink MVP

> **A comprehensive learning platform that connects learners with mentors through interactive features including chat, topic rooms, live classes, and collaborative projects.**

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green.svg)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue.svg)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black.svg)](https://vercel.com/)

## ✨ Features

### 🎓 Core Learning Platform
- **👥 Mentor Discovery** - Advanced search and matching system with filters
- **💬 Real-time Chat** - Direct messaging with file sharing and video calls
- **🏠 Topic Rooms** - Community discussions organized by skills and interests
- **📋 Project Collaboration** - Hands-on learning projects with progress tracking
- **❓ Q&A System** - Community-driven knowledge sharing and voting
- **🎥 Live Classes** - Interactive learning sessions and tutorials
- **🏆 Gamification** - XP points, levels, badges, and achievement system

### 🔐 User Management
- **Multi-role Authentication** - Learners, mentors, and administrators
- **Comprehensive Profiles** - Skills, interests, bio, and progress tracking
- **Social Features** - Following, connections, and community engagement
- **Privacy Controls** - Granular privacy settings and data protection

### 🛠️ Technical Features
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **⚡ Real-time Updates** - Live notifications, messaging, and activity feeds
- **📁 File Management** - Document sharing and resource libraries
- **🔍 Advanced Search** - Smart filtering and recommendation algorithms
- **🌐 PWA Ready** - Installable progressive web application

## 🚀 Quick Start

### Prerequisites
```bash
# Required software
Node.js 18+
pnpm (npm install -g pnpm)
Git
```

### Installation
```bash
# 1. Clone the repository
git clone <repository-url>
cd skilllink

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cd web
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Start development server
pnpm run dev
```

### 🎮 Demo Accounts
Test the platform with these pre-configured accounts:

| Role | Email | Password |
|------|-------|----------|
| **Learner** | learner@test.com | Demo1234! |
| **Mentor** | mentor@test.com | Demo1234! |
| **Admin** | admin@test.com | Demo1234! |

## 🚀 Deployment

### 🤖 Automated Deployment
```bash
# Make script executable and run
chmod +x deploy.sh
./deploy.sh
```

### 🔧 Manual Deployment

#### Frontend (Vercel)
```bash
cd web
pnpm run build
vercel --prod
```

#### Database (Supabase)
```bash
cd backend
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

## 📁 Project Structure

```
skilllink/
├── 🌐 web/                    # React frontend application
│   ├── src/
│   │   ├── 🧩 components/     # Reusable UI components
│   │   │   ├── auth/          # Authentication components
│   │   │   ├── discovery/     # Mentor search & topic rooms
│   │   │   ├── chat/          # Real-time messaging
│   │   │   └── collaboration/ # Project management
│   │   ├── 🔧 contexts/       # React contexts (Auth, etc.)
│   │   ├── 📚 lib/           # Utilities and Supabase client
│   │   └── App.jsx           # Main application component
│   └── 📦 package.json       # Frontend dependencies
├── 🗄️ backend/               # Supabase configuration
│   ├── supabase/
│   │   ├── migrations/       # Database schema migrations
│   │   ├── functions/        # Edge functions
│   │   └── config.toml       # Supabase configuration
│   └── seed.sql             # Sample data and demo accounts
├── 🤝 shared/               # Shared utilities and types
├── 📱 mobile/               # React Native app (future)
├── 🚀 deploy.sh            # Automated deployment script
├── 📖 DOCUMENTATION.md     # Comprehensive documentation
└── 📋 README.md           # This file
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and authentication
- [ ] Profile setup and management
- [ ] Mentor search and filtering
- [ ] Topic room discussions
- [ ] Real-time chat functionality
- [ ] Project creation and collaboration
- [ ] Responsive design on all devices
- [ ] Performance and loading times

## 🤝 Contributing

### Development Guidelines
1. **Fork** the repository and create a feature branch
2. **Follow** existing code patterns and conventions
3. **Test** changes thoroughly on multiple devices
4. **Document** new features and API changes
5. **Submit** pull request with detailed description

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for the learning community**

[🌟 Star this repo](https://github.com/your-username/skilllink) • [🐛 Report Bug](https://github.com/your-username/skilllink/issues) • [✨ Request Feature](https://github.com/your-username/skilllink/issues)

</div>
