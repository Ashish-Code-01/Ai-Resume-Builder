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

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Fetch resume when authenticated
  useEffect(() => {
    if (status === 'authenticated' && params.id) {
      fetchResume();
    }
  }, [status, params.id]);

  // ✅ Fetch Resume
  const fetchResume = async () => {
    try {
      const response = await fetch(`/api/resumes/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        const safeContent = {
          personalInfo: data.resume.content?.personalInfo || {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            summary: '',
          },
          experience: data.resume.content?.experience || [],
          education: data.resume.content?.education || [],
          skills: data.resume.content?.skills || [],
        };

        setResume({ ...data.resume, content: safeContent });

        setTitle(data.resume.title || '');
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


  // ✅ Save title
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
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update title',
        variant: 'destructive',
      });
    }
  };

  // ✅ Save layout
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
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save layout',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ Placeholder export and AI generation
  const handleExportPDF = () =>
    toast({
      title: 'Coming Soon',
      description: 'PDF export functionality will be available soon',
    });

  const handleGenerateWithAI = () => {
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

  const handleAddExperience = () =>
    setResume((prev: any) => ({
      ...prev,
      content: { ...prev.content, experience: [...(prev.content.experience || []), { company: '', position: '', startDate: '', endDate: '', description: '' }] },
    }));

  const handleAddEducation = () =>
    setResume((prev: any) => ({
      ...prev,
      content: { ...prev.content, education: [...(prev.content.education || []), { school: '', degree: '', startDate: '', endDate: '', description: '' }] },
    }));

  const handleAddSkill = () =>
    setResume((prev: any) => ({
      ...prev,
      content: { ...prev.content, skills: [...(prev.content.skills || []), ''] },
    }));

  // ✅ Loading state
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
      {/* Header */}
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

      {/* Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="canvas" className="h-full flex flex-col">
          <div className="border-b px-6">
            <TabsList>
              <TabsTrigger value="canvas">Canvas Editor</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>
          </div>

          {/* Canvas Editor */}
          <TabsContent value="canvas" className="flex-1 m-0">
            <CanvasEditor
              resumeContent={resume.content}
              initialLayout={resume.canvasLayout}
              onSave={handleSaveLayout}
              onExport={handleExportPDF}
            />
          </TabsContent>

          {/* Resume Content Editor */}
          <TabsContent value="content" className="flex-1 m-0 overflow-auto">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
              {/* ✅ Personal Info Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Full Name</label>
                      <Input
                        value={resume?.content?.personalInfo?.fullName || ''}
                        onChange={(e) =>
                          setResume((prev: any) => ({
                            ...prev,
                            content: {
                              ...prev.content,
                              personalInfo: {
                                ...prev.content.personalInfo,
                                fullName: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        type="email"
                        value={resume?.content?.personalInfo?.email || ''}
                        onChange={(e) =>
                          setResume((prev: any) => ({
                            ...prev,
                            content: {
                              ...prev.content,
                              personalInfo: {
                                ...prev.content.personalInfo,
                                email: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <Input
                        value={resume?.content?.personalInfo?.phone || ''}
                        onChange={(e) =>
                          setResume((prev: any) => ({
                            ...prev,
                            content: {
                              ...prev.content,
                              personalInfo: {
                                ...prev.content.personalInfo,
                                phone: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Location</label>
                      <Input
                        value={resume?.content?.personalInfo?.location || ''}
                        onChange={(e) =>
                          setResume((prev: any) => ({
                            ...prev,
                            content: {
                              ...prev.content,
                              personalInfo: {
                                ...prev.content.personalInfo,
                                location: e.target.value,
                              },
                            },
                          }))
                        }
                        placeholder="New York, NY"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Professional Summary</label>
                    <Textarea
                      value={resume?.content?.personalInfo?.summary || ''}
                      onChange={(e) =>
                        setResume((prev: any) => ({
                          ...prev,
                          content: {
                            ...prev.content,
                            personalInfo: {
                              ...prev.content.personalInfo,
                              summary: e.target.value,
                            },
                          },
                        }))
                      }
                      placeholder="Brief professional summary..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Experience Section */}
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle>Experience</CardTitle>
                  <Button size="sm" variant="outline" onClick={handleAddExperience}>Add Experience</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resume.content.experience?.map((exp: any, i: number) => (
                    <div key={i} className="space-y-2 border-b pb-2">
                      <Input placeholder="Company" value={exp.company} onChange={(e) => { const updated = [...resume.content.experience]; updated[i].company = e.target.value; setResume((prev: any) => ({ ...prev, content: { ...prev.content, experience: updated } })); }} />
                      <Input placeholder="Position" value={exp.position} onChange={(e) => { const updated = [...resume.content.experience]; updated[i].position = e.target.value; setResume((prev: any) => ({ ...prev, content: { ...prev.content, experience: updated } })); }} />
                      <Textarea placeholder="Description" value={exp.description} rows={3} onChange={(e) => { const updated = [...resume.content.experience]; updated[i].description = e.target.value; setResume((prev: any) => ({ ...prev, content: { ...prev.content, experience: updated } })); }} />
                    </div>
                  ))}
                </CardContent>
              </Card>
              {/* Education Section */}
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle>Education</CardTitle>
                  <Button size="sm" variant="outline" onClick={handleAddEducation}>Add Education</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resume.content.education?.map((edu: any, i: number) => (
                    <div key={i} className="space-y-2 border-b pb-2">
                      <Input placeholder="School" value={edu.school} onChange={(e) => { const updated = [...resume.content.education]; updated[i].school = e.target.value; setResume((prev: any) => ({ ...prev, content: { ...prev.content, education: updated } })); }} />
                      <Input placeholder="Degree" value={edu.degree} onChange={(e) => { const updated = [...resume.content.education]; updated[i].degree = e.target.value; setResume((prev: any) => ({ ...prev, content: { ...prev.content, education: updated } })); }} />
                      <Textarea placeholder="Description" value={edu.description} rows={3} onChange={(e) => { const updated = [...resume.content.education]; updated[i].description = e.target.value; setResume((prev: any) => ({ ...prev, content: { ...prev.content, education: updated } })); }} />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Skills Section */}
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle>Skills</CardTitle>
                  <Button size="sm" variant="outline" onClick={handleAddSkill}>Add Skill</Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  {resume.content.skills?.map((skill: string, i: number) => (
                    <Input key={i} placeholder="Skill" value={skill} onChange={(e) => { const updated = [...resume.content.skills]; updated[i] = e.target.value; setResume((prev: any) => ({ ...prev, content: { ...prev.content, skills: updated } })); }} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
