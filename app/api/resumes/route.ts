import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Resume from '@/models/Resume';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const resumes = await Resume.find({ userId: session.user.id })
      .sort({ updatedAt: -1 })
      .select('-__v');

    return NextResponse.json({ resumes });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, canvasLayout } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    await connectDB();

    const resumeCount = await Resume.countDocuments({ userId: session.user.id });

    if (session.user.subscriptionTier === 'free' && resumeCount >= 3) {
      return NextResponse.json(
        { error: 'Free users are limited to 3 resumes. Upgrade to Pro for unlimited resumes.' },
        { status: 403 }
      );
    }

    const resume = await Resume.create({
      userId: session.user.id,
      title,
      content: content || {},
      canvasLayout: canvasLayout || {
        width: 816,
        height: 1056,
        backgroundColor: '#ffffff',
        sections: [],
      },
    });

    return NextResponse.json({ resume }, { status: 201 });
  } catch (error) {
    console.error('Error creating resume:', error);
    return NextResponse.json({ error: 'Failed to create resume' }, { status: 500 });
  }
}
