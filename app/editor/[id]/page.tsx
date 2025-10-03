'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const CanvasEditor = dynamic(() => import('@/components/canvas/canvas-editor'), {
  ssr: false,
});

export default function EditorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [resume, setResume] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && params.id) {
      fetchResume();
    }
  }, [status, params.id]);

  const fetchResume = async () => {
    try {
      const response = await fetch(`/api/resumes/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setResume(data.resume);
        setTitle(data.resume.title);
      } else {
        toast({
          title: 'Error',
          description: 'Resume not found',
          variant: 'destructive',
        });
        router.push('/dashboard');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch resume',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTitle = async () => {
    if (!resume) return;

    try {
      const response = await fetch(`/api/resumes/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Title updated',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update title',
        variant: 'destructive',
      });
    }
  };

  const handleSaveLayout = async (layout: any) => {
    if (!resume) return;
    setIsSaving(true);

    try {
      const response = await fetch(`/api/resumes/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canvasLayout: layout }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Layout saved successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save layout',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    toast({
      title: 'Coming Soon',
      description: 'PDF export functionality will be available soon',
    });
  };

  const handleGenerateWithAI = async () => {
    if (session?.user.subscriptionTier !== 'pro') {
      toast({
        title: 'Pro Feature',
        description: 'AI generation is only available for Pro users',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Coming Soon',
      description: 'AI generation will be integrated soon',
    });
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (!session || !resume) return null;

  const isPro = session.user.subscriptionTier === 'pro';

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSaveTitle}
              className="font-semibold"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isPro && (
            <Button variant="outline" size="sm" onClick={handleGenerateWithAI}>
              <Sparkles className="h-4 w-4 mr-2" />
              AI Assist
            </Button>
          )}
          {isSaving && <span className="text-sm text-slate-500">Saving...</span>}
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="canvas" className="h-full flex flex-col">
          <div className="border-b px-6">
            <TabsList>
              <TabsTrigger value="canvas">Canvas Editor</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="canvas" className="flex-1 m-0">
            <CanvasEditor
              resumeContent={resume.content}
              initialLayout={resume.canvasLayout}
              onSave={handleSaveLayout}
              onExport={handleExportPDF}
            />
          </TabsContent>

          <TabsContent value="content" className="flex-1 m-0 overflow-auto">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <Input
                        value={resume.content?.personalInfo?.fullName || ''}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        type="email"
                        value={resume.content?.personalInfo?.email || ''}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <Input
                        value={resume.content?.personalInfo?.phone || ''}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Location</label>
                      <Input
                        value={resume.content?.personalInfo?.location || ''}
                        placeholder="New York, NY"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Professional Summary</label>
                    <Textarea
                      value={resume.content?.personalInfo?.summary || ''}
                      placeholder="Brief professional summary..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Experience</CardTitle>
                    <Button size="sm" variant="outline">
                      Add Experience
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500">
                    Experience entries will be editable here
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Education</CardTitle>
                    <Button size="sm" variant="outline">
                      Add Education
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500">
                    Education entries will be editable here
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Skills</CardTitle>
                    <Button size="sm" variant="outline">
                      Add Skills
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500">Skills will be editable here</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
