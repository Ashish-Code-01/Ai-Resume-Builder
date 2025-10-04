'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Trash2, CreditCard as Edit, Crown, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signOut } from 'next-auth/react';
import axios from 'axios';

interface Resume {
  _id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchResumes();
    }
  }, [status]);

  const fetchResumes = async () => {
    try {
      const response = await fetch('/api/resumes');
      const data = await response.json();

      if (response.ok) {
        setResumes(data.resumes);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch resumes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateResume = async () => {
    const data = {
      title: "Untitled Resume",
      content: {},
      canvasLayout: {
        width: 816,
        height: 1056,
        backgroundColor: "#ffffff",
        sections: [],
      },
    };

    try {
      const response = await axios.post("/api/resumes", data);
      
      const responseData = response.data;

      if (response.status === 200 && responseData?.resume?._id) {
        router.push(`/editor/${responseData.resume._id}`);
      } else {
        toast({
          title: "Error",
          description: responseData.error || "Failed to create resume",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.error || "Failed to create resume frontend",
        variant: "destructive",
      });
    }
  };


  const handleDeleteResume = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setResumes(resumes.filter((r) => r._id !== id));
        toast({
          title: 'Success',
          description: 'Resume deleted successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete resume',
        variant: 'destructive',
      });
    }
  };

  const handleUpgrade = async () => {
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'pro' }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start checkout',
        variant: 'destructive',
      });
    }
  };

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to open billing portal',
        variant: 'destructive',
      });
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const isPro = session.user.subscriptionTier === 'pro';
  const canCreateMore = isPro || resumes.length < 3;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold">AI Resume Builder</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isPro ? (
                <>
                  <Badge variant="default" className="bg-amber-500">
                    <Crown className="h-3 w-3 mr-1" />
                    Pro
                  </Badge>
                  <Button variant="outline" size="sm" onClick={handleManageBilling}>
                    Manage Billing
                  </Button>
                </>
              ) : (
                <Button variant="default" size="sm" onClick={handleUpgrade}>
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Pro
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Welcome back, {session.user.name || session.user.email}
              </h2>
              <p className="text-slate-600 mt-1">Create and manage your professional resumes</p>
            </div>
            <Button onClick={handleCreateResume} disabled={!canCreateMore} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              New Resume
            </Button>
          </div>

          {!isPro && (
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-900">
                      Free Plan: {resumes.length}/3 resumes used
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Upgrade to Pro for unlimited resumes and AI features
                    </p>
                  </div>
                  <Button onClick={handleUpgrade} variant="default">
                    Upgrade Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {resumes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No resumes yet</h3>
              <p className="text-slate-600 mb-6">
                Create your first resume to get started
              </p>
              <Button onClick={handleCreateResume}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Resume
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Card key={resume._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{resume.title}</CardTitle>
                  <CardDescription>
                    Updated {new Date(resume.updatedAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/editor/${resume._id}`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteResume(resume._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
