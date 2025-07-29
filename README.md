# Visual Spect Driven AI

A NextJS 14 application that provides a spec-driven development assistant with AI-powered voice commands and tldraw integration.

## 🚀 Features

- **AI-Powered Voice Commands**: Use natural language to generate visual designs
- **tldraw Integration**: Create and edit visual designs with a powerful drawing tool
- **Project Management**: Organize and manage your design projects
- **Version Control**: Track changes and maintain version history
- **Real-time Collaboration**: Work together with team members
- **Multiple Design Modes**: Web, mobile, database, and architecture design modes

## 🛠 Tech Stack

- **Frontend**: NextJS 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: NextJS API Routes, MongoDB with Mongoose
- **UI Components**: shadcn/ui, Radix UI
- **Drawing**: tldraw v3
- **AI**: OpenAI API
- **Speech**: Web Speech API
- **State Management**: Zustand
- **Validation**: Zod

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/visual-spect-driven-ai.git
cd visual-spect-driven-ai
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your configuration:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/visual-spect-ai

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Application Configuration
NODE_ENV=development
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄 Database Setup

This project uses MongoDB as the database. Make sure you have MongoDB installed and running locally, or use a cloud MongoDB service like MongoDB Atlas.

### Local MongoDB Setup

1. Install MongoDB Community Edition
2. Start MongoDB service
3. Create a database named `visual-spect-ai`

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env.local` file

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                 # API routes
│   │   ├── projects/        # Project CRUD operations
│   │   ├── users/           # User management
│   │   └── ai/              # AI command processing
│   ├── dashboard/           # Dashboard page
│   ├── project/             # Project detail pages
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── dashboard/           # Dashboard components
│   ├── project/             # Project components
│   ├── tldraw/              # tldraw wrapper
│   └── ai/                  # AI components
├── lib/
│   ├── mongodb.ts           # Database connection
│   ├── utils.ts             # Utility functions
│   └── validations.ts       # Zod schemas
├── models/
│   ├── User.ts              # User model
│   ├── Project.ts           # Project model
│   └── Version.ts           # Version model
├── hooks/
│   ├── useProjects.ts       # Project management hook
│   ├── useSpeechRecognition.ts
│   └── use-toast.ts
└── types/
    └── index.ts             # TypeScript types
```

## 🔧 API Endpoints

### Projects

- `GET /api/projects` - Get all projects for a user
- `POST /api/projects` - Create a new project
- `GET /api/projects/[id]` - Get project details
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Versions

- `GET /api/projects/[id]/versions` - Get project versions
- `POST /api/projects/[id]/versions` - Create new version

### Users

- `GET /api/users` - Get user by email
- `POST /api/users` - Create new user
- `PUT /api/users` - Update user

### AI Commands

- `POST /api/ai/process-command` - Process AI voice commands

## 🎯 Usage

1. **Create a Project**: Use the dashboard to create new design projects
2. **Voice Commands**: Use the AI assistant to generate designs with voice commands
3. **Visual Design**: Use tldraw to create and edit visual designs
4. **Version Control**: Track changes and maintain version history
5. **Collaboration**: Share projects with team members

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports NextJS:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [tldraw](https://tldraw.com/) for the amazing drawing tool
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [NextJS](https://nextjs.org/) for the powerful React framework
- [OpenAI](https://openai.com/) for the AI capabilities
