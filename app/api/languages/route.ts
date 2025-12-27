import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settings from '@/models/Settings';

export async function GET() {
  try {
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
      {
        defaultLanguage: 'en',
        availableLanguages: ['en'],
      },
      { status: 200 }
    );
  }
}

