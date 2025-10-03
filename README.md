# AI Resume Builder SaaS

A production-ready SaaS application for building professional resumes with AI-powered content generation and drag-and-drop customization.

## Features

### Core Features
- **AI-Powered Content Generation** - Generate professional resume content using Google's Gemini AI
- **Drag-and-Drop Canvas Editor** - Interactive resume builder with Konva.js for visual customization
- **Authentication & Authorization** - Secure authentication with NextAuth.js (Google & Email)
- **User Dashboard** - CRUD operations for managing multiple resumes
- **PDF Export** - Export resumes as professional PDFs
- **SaaS Monetization** - Stripe integration for subscription management

### User Tiers
- **Free Tier**
  - Up to 3 resumes
  - Basic templates
  - PDF export

- **Pro Tier** ($9.99/month)
  - Unlimited resumes
  - AI content generation
  - Advanced canvas customization
  - Public resume links
  - Priority support

## Tech Stack

- **Frontend**: Next.js 13 (App Router), React 18, TailwindCSS, shadcn/ui
- **Canvas Editor**: Konva.js, React-Konva
- **AI**: Google Gemini AI API
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **PDF Generation**: jsPDF, html2canvas
- **Language**: TypeScript

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts  # NextAuth configuration
│   │   │   └── register/route.ts        # User registration
│   │   ├── resumes/
│   │   │   ├── route.ts                 # Resume CRUD
│   │   │   └── [id]/route.ts            # Individual resume operations
│   │   ├── ai/
│   │   │   └── generate/route.ts        # AI content generation
│   │   └── stripe/
│   │       ├── checkout/route.ts        # Stripe checkout
│   │       ├── portal/route.ts          # Billing portal
│   │       └── webhook/route.ts         # Stripe webhooks
│   ├── auth/
│   │   ├── signin/page.tsx              # Sign in page
│   │   └── signup/page.tsx              # Sign up page
│   ├── dashboard/page.tsx               # User dashboard
│   ├── editor/[id]/page.tsx             # Resume editor
│   ├── layout.tsx
│   └── page.tsx                         # Landing page
├── components/
│   ├── canvas/
│   │   └── canvas-editor.tsx            # Konva canvas editor
│   ├── providers/
│   │   └── session-provider.tsx         # Auth provider
│   └── ui/                              # shadcn/ui components
├── lib/
│   ├── mongodb.ts                       # MongoDB connection
│   ├── gemini.ts                        # Gemini AI service
│   ├── stripe.ts                        # Stripe service
│   ├── pdf-export.ts                    # PDF generation
│   └── utils.ts
├── models/
│   ├── User.ts                          # User schema
│   ├── Resume.ts                        # Resume schema
│   └── AIGeneration.ts                  # AI generation tracking
└── types/
    └── next-auth.d.ts                   # NextAuth type extensions
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud)
- Google OAuth credentials
- Gemini AI API key
- Stripe account

### Installation

1. **Clone the repository and install dependencies**

```bash
npm install
```

2. **Configure environment variables**

Create a `.env` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/resume-builder

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# Stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
STRIPE_PRO_PRICE_ID=your-stripe-price-id
```

### Setting Up Services

#### 1. MongoDB Setup

**Local MongoDB:**
```bash
# Install MongoDB locally
# macOS
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

**Cloud MongoDB (MongoDB Atlas):**
- Create a free cluster at https://www.mongodb.com/cloud/atlas
- Get your connection string
- Update `MONGODB_URI` in `.env`

#### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env`

#### 3. Gemini AI Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Copy the key to `GEMINI_API_KEY` in `.env`

#### 4. Stripe Setup

1. Create account at [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get API keys from Developers > API keys
3. Create a product and price for Pro plan
4. Copy Price ID to `STRIPE_PRO_PRICE_ID`
5. Set up webhook endpoint:
   - URL: `https://yourdomain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
6. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### Resumes
- `GET /api/resumes` - Get all user resumes
- `POST /api/resumes` - Create new resume
- `GET /api/resumes/[id]` - Get specific resume
- `PUT /api/resumes/[id]` - Update resume
- `DELETE /api/resumes/[id]` - Delete resume

### AI Generation
- `POST /api/ai/generate` - Generate AI content
  - `type: 'full'` - Generate complete resume
  - `type: 'section'` - Generate specific section
  - `type: 'rewrite'` - Rewrite existing content
  - `type: 'tailor'` - Tailor resume to job description

### Stripe
- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/stripe/portal` - Create billing portal session
- `POST /api/stripe/webhook` - Handle Stripe webhooks

## Usage Guide

### For Users

1. **Sign Up / Sign In**
   - Create account with email or Google
   - Free tier gives you 3 resumes

2. **Create Resume**
   - Click "New Resume" from dashboard
   - Opens in the editor

3. **Edit Resume**
   - **Content Tab**: Edit resume data (personal info, experience, education, skills)
   - **Canvas Tab**: Drag and drop to customize layout

4. **Use AI Features** (Pro only)
   - Click "AI Assist" button
   - Generate content from scratch
   - Rewrite sections
   - Tailor to job descriptions

5. **Export**
   - Click "Export PDF"
   - Download professional PDF

6. **Upgrade to Pro**
   - Click "Upgrade to Pro"
   - Complete Stripe checkout
   - Get unlimited resumes and AI features

### For Developers

#### Adding New Resume Sections

1. Update `models/Resume.ts` to add new section type
2. Modify `lib/gemini.ts` to generate content for new section
3. Update canvas editor to render new section
4. Add UI controls in editor page

#### Customizing AI Prompts

Edit prompts in `lib/gemini.ts`:
- `generateResumeContent()` - Full resume generation
- `rewriteSection()` - Section rewriting
- `tailorResumeToJob()` - Job tailoring
- `generateSectionContent()` - Section generation

#### Adding New Subscription Plans

1. Create plan in Stripe Dashboard
2. Add to `STRIPE_PLANS` in `lib/stripe.ts`
3. Update UI in dashboard and landing page
4. Add plan-specific features

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
# Or use Vercel CLI
vercel --prod
```

### Other Platforms

Compatible with any platform supporting Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## Security Considerations

- Environment variables are never exposed to client
- API routes validate authentication
- Stripe webhooks verify signatures
- MongoDB connection uses secure credentials
- CORS configured for API endpoints
- Input validation on all forms
- XSS protection enabled

## License

MIT License - feel free to use for personal or commercial projects.

## Support

For issues and feature requests, please open an issue on GitHub.

---

Built with Next.js, Gemini AI, MongoDB, and Stripe
#   A i - R e s u m e - B u i l d e r 
 
 # Ai-Resume-Builder
