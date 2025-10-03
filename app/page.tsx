import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Sparkles, LayoutGrid as Layout, Download, Crown, Check } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">AI Resume Builder</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Build Professional Resumes
            <br />
            <span className="text-blue-600">Powered by AI</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Create stunning, ATS-friendly resumes with AI-powered content generation and
            intuitive drag-and-drop customization
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/auth/signup">
                Start Building Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Sparkles className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>AI-Powered Content</CardTitle>
                <CardDescription>
                  Generate professional resume content tailored to your experience with Gemini AI
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Layout className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Drag & Drop Editor</CardTitle>
                <CardDescription>
                  Customize your resume layout with an intuitive canvas-based editor
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Download className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Export to PDF</CardTitle>
                <CardDescription>
                  Download professional PDFs ready to send to employers
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold text-center mb-12">Simple Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <div className="text-3xl font-bold mt-4">$0</div>
                <CardDescription>Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-2" />
                    Up to 3 resumes
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-2" />
                    Basic templates
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-2" />
                    PDF export
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline" asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-blue-600 border-2 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-4 py-1">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Crown className="h-6 w-6 text-amber-500 mr-2" />
                  Pro
                </CardTitle>
                <div className="text-3xl font-bold mt-4">
                  $9.99<span className="text-base font-normal text-slate-500">/month</span>
                </div>
                <CardDescription>For professionals</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-2" />
                    Unlimited resumes
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-2" />
                    AI content generation
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-2" />
                    Advanced canvas editor
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-2" />
                    Public resume links
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-2" />
                    Priority support
                  </li>
                </ul>
                <Button className="w-full mt-6" asChild>
                  <Link href="/auth/signup">Upgrade to Pro</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-slate-600">
            © 2025 AI Resume Builder. Built with Next.js, Gemini AI, and Fabric.js
          </p>
        </div>
      </footer>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}
