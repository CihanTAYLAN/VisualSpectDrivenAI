# Visual Spect Driven AI - Project Planning

## 🎯 Project Overview

Visual Spect Driven AI is a NextJS 14 application that provides a spec-driven development assistant with AI-powered voice commands and tldraw integration.

## ✅ Completed Features

### Core Infrastructure

- [x] NextJS 14 App Router setup
- [x] TypeScript configuration
- [x] Tailwind CSS with shadcn/ui components
- [x] MongoDB connection setup
- [x] Basic project structure

### Database Integration

- [x] MongoDB connection with connection pooling
- [x] User model with preferences
- [x] Project model with settings
- [x] Version model with AI commands
- [x] Real data fetching and CRUD operations
- [x] Error handling and validation
- [x] API response standardization

### Authentication System

- [x] NextAuth.js configuration
- [x] Credentials provider with password hashing
- [x] Sign-in and Sign-up pages
- [x] Session management
- [x] Protected routes with middleware
- [x] User registration and login
- [x] Session hooks and utilities

### UI Components

- [x] Button component
- [x] Dialog component
- [x] Input component
- [x] Label component
- [x] Textarea component
- [x] Toast component
- [x] Tabs component
- [x] Card component
- [x] Separator component

### Pages

- [x] Home page with authentication-aware content
- [x] Dashboard page with session management
- [x] Sign-in page with Google OAuth
- [x] Sign-up page with form validation
- [x] Project detail page layout

### Components

- [x] ProjectGrid component
- [x] ProjectCard component
- [x] CreateProjectDialog component
- [x] AIAssistant component
- [x] TldrawWrapper component
- [x] ProjectLayout component
- [x] VersionPanel component

### API Routes

- [x] Projects API (GET, POST, PUT, DELETE)
- [x] Project versions API (GET, POST)
- [x] Users API (GET, POST, PUT) with password hashing
- [x] AI command processing API
- [x] NextAuth API routes

### Models

- [x] User model with preferences and password
- [x] Project model with settings
- [x] Version model with AI commands

### Hooks

- [x] useProjects hook for project management
- [x] useSession hook for authentication
- [x] useProtectedSession hook for protected routes
- [x] useSpeechRecognition hook
- [x] useToast hook

### Utilities

- [x] MongoDB connection utilities
- [x] API response helpers
- [x] Validation helpers
- [x] Date formatting utilities
- [x] Authentication utilities

## 🚧 In Progress

### AI Integration

- [ ] OpenAI API integration
- [ ] Voice command processing
- [ ] tldraw element generation

## 📋 TODO Features

### High Priority

1. **AI Voice Commands**

   - [ ] OpenAI API integration
   - [ ] Voice command processing
   - [ ] tldraw element generation
   - [ ] Command history

2. **tldraw Integration**
   - [ ] Canvas data persistence
   - [ ] Real-time collaboration
   - [ ] Version control for drawings
   - [ ] Export/Import functionality

### Medium Priority

3. **Version Control**

   - [ ] Version history UI
   - [ ] Version comparison
   - [ ] Rollback functionality
   - [ ] Changelog management

4. **Design Modes**

   - [ ] Web design mode
   - [ ] Mobile design mode
   - [ ] Database design mode
   - [ ] Architecture design mode

5. **Real-time Features**
   - [ ] WebSocket integration
   - [ ] Live collaboration
   - [ ] Real-time updates
   - [ ] Presence indicators

### Low Priority

6. **Advanced Features**

   - [ ] Project templates
   - [ ] Export to different formats
   - [ ] Advanced AI commands
   - [ ] Custom themes

7. **Performance & UX**
   - [ ] Loading states
   - [ ] Error boundaries
   - [ ] Progressive loading
   - [ ] Mobile responsiveness

## 🛠 Technical Stack

### Frontend

- **Framework**: NextJS 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React hooks + Zustand
- **Icons**: Lucide React

### Backend

- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js with credentials provider
- **AI**: OpenAI API
- **Validation**: Zod

### External Services

- **Drawing**: tldraw (v2.0+)
- **Speech**: Web Speech API
- **Deployment**: Vercel (planned)

## 📁 Project Structure

```
src/
├── app/
│   ├── auth/              # Authentication pages
│   │   ├── signin/        # Sign-in page
│   │   └── signup/        # Sign-up page
│   ├── dashboard/         # Dashboard page
│   ├── project/           # Project pages
│   ├── api/              # API routes
│   │   ├── auth/         # NextAuth routes
│   │   ├── projects/     # Project CRUD operations
│   │   ├── users/        # User management
│   │   └── ai/           # AI command processing
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard components
│   ├── project/          # Project components
│   ├── tldraw/           # tldraw wrapper
│   └── ai/               # AI components
├── lib/
│   ├── mongodb.ts        # Database connection
│   ├── auth.ts           # NextAuth configuration
│   ├── validations.ts    # Zod schemas
│   └── utils.ts          # Utility functions
├── models/
│   ├── User.ts           # User model
│   ├── Project.ts        # Project model
│   └── Version.ts        # Version model
├── hooks/
│   ├── useProjects.ts    # Project management hook
│   ├── useSession.ts     # Authentication hooks
│   ├── useSpeechRecognition.ts
│   └── use-toast.ts
├── middleware.ts         # Protected routes middleware
└── types/
    └── index.ts          # TypeScript types
```

## 🎨 Design System

### Colors

- Primary: Blue shades
- Secondary: Gray shades
- Success: Green
- Error: Red
- Warning: Yellow

### Typography

- Font: Inter (Google Fonts)
- Headings: Bold weights
- Body: Regular weights

### Components

- Consistent spacing (4px grid)
- Rounded corners (md: 6px, lg: 8px)
- Shadows for depth
- Hover states for interactivity

## 🔧 Development Guidelines

### Code Style

- Use TypeScript strictly
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful component names
- Add proper TypeScript types

### Component Structure

- Use 'use client' for client components
- Implement proper error boundaries
- Add loading states
- Use proper accessibility attributes

### API Design

- RESTful API endpoints
- Proper error handling
- Input validation with Zod
- Standardized response format

### Database Guidelines

- Use Mongoose for MongoDB operations
- Implement proper connection pooling
- Add comprehensive error handling
- Use lean() queries for read operations
- Implement proper indexing strategies

### Authentication Guidelines

- Use NextAuth.js for authentication
- Implement proper session management
- Add middleware for protected routes
- Hash passwords with bcrypt
- Validate user input with Zod
