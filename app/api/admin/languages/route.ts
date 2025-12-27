import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/types/user';
import connectDB from '@/lib/mongodb';
import Settings from '@/models/Settings';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const settings = await Settings.getSettings();

    return NextResponse.json(
      {
        defaultLanguage: settings.defaultLanguage,
        availableLanguages: settings.availableLanguages,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching language settings:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { defaultLanguage, availableLanguages } = body;

    if (!defaultLanguage || !availableLanguages || !Array.isArray(availableLanguages)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    if (!availableLanguages.includes(defaultLanguage)) {
      return NextResponse.json(
        { error: 'Default language must be in available languages' },
        { status: 400 }
      );
    }

    if (availableLanguages.length === 0) {
      return NextResponse.json(
        { error: 'At least one language must be available' },
        { status: 400 }
      );
    }

    await connectDB();
    const settings = await Settings.getSettings();

    settings.defaultLanguage = defaultLanguage;
    settings.availableLanguages = availableLanguages;
    await settings.save();

    return NextResponse.json(
      {
        message: 'Language settings updated successfully',
        defaultLanguage: settings.defaultLanguage,
        availableLanguages: settings.availableLanguages,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating language settings:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

