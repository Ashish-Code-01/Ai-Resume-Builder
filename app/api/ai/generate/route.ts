import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import AIGeneration from '@/models/AIGeneration';
import { generateResumeContent, rewriteSection, tailorResumeToJob, generateSectionContent } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.subscriptionTier === 'free') {
      return NextResponse.json(
        { error: 'AI features are only available for Pro users. Please upgrade your subscription.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { type, data, resumeId } = body;

    if (!type) {
      return NextResponse.json({ error: 'Type is required' }, { status: 400 });
    }

    await connectDB();

    let result;
    let prompt = '';

    switch (type) {
      case 'full':
        if (!data.fullName || !data.email) {
          return NextResponse.json(
            { error: 'Full name and email are required' },
            { status: 400 }
          );
        }
        result = await generateResumeContent(data);
        prompt = `Generate full resume for ${data.fullName}`;
        break;

      case 'section':
        if (!data.sectionType || !data.context) {
          return NextResponse.json(
            { error: 'Section type and context are required' },
            { status: 400 }
          );
        }
        result = await generateSectionContent(data.sectionType, data.context, data.existingContent);
        prompt = `Generate ${data.sectionType} section`;
        break;

      case 'rewrite':
        if (!data.content) {
          return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }
        result = await rewriteSection(data.content, data.instructions);
        prompt = `Rewrite section: ${data.content.substring(0, 100)}...`;
        break;

      case 'tailor':
        if (!data.resumeContent || !data.jobDescription) {
          return NextResponse.json(
            { error: 'Resume content and job description are required' },
            { status: 400 }
          );
        }
        result = await tailorResumeToJob(data.resumeContent, data.jobDescription);
        prompt = `Tailor resume to job: ${data.jobDescription.substring(0, 100)}...`;
        break;

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    await AIGeneration.create({
      userId: session.user.id,
      resumeId: resumeId || undefined,
      prompt,
      response: typeof result === 'string' ? result : JSON.stringify(result),
      generationType: type,
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error generating AI content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content. Please try again.' },
      { status: 500 }
    );
  }
}
