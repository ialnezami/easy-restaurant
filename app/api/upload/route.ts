import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Convert file to base64 for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;

    // Validate Cloudinary configuration
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || cloudName.trim() === '') {
      console.error('Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME environment variable');
      return NextResponse.json(
        { 
          error: 'Cloudinary cloud name is not configured',
          details: {
            message: 'Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in your environment variables',
            help: 'See CLOUDINARY_SETUP.md for setup instructions',
            cloudName: 'Missing',
            uploadPreset: uploadPreset ? 'Set' : 'Missing',
          }
        },
        { status: 500 }
      );
    }

    if (!uploadPreset || uploadPreset.trim() === '') {
      console.error('Missing CLOUDINARY_UPLOAD_PRESET environment variable');
      return NextResponse.json(
        { 
          error: 'Cloudinary upload preset is not configured',
          details: {
            message: 'Please set CLOUDINARY_UPLOAD_PRESET in your environment variables',
            help: 'See CLOUDINARY_SETUP.md for setup instructions',
            cloudName: 'Set',
            uploadPreset: 'Missing',
          }
        },
        { status: 500 }
      );
    }

    // Upload to Cloudinary using unsigned upload with preset
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    // Cloudinary accepts base64 data URI in the file parameter
    const cloudinaryFormData = new URLSearchParams();
    cloudinaryFormData.append('file', dataURI);
    cloudinaryFormData.append('upload_preset', uploadPreset);
    cloudinaryFormData.append('folder', 'menu-items'); // Organize uploads in folders

    const cloudinaryResponse = await fetch(cloudinaryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: cloudinaryFormData.toString(),
    });

    if (!cloudinaryResponse.ok) {
      let errorMessage = 'Failed to upload image to Cloudinary';
      try {
        const errorData = await cloudinaryResponse.json();
        console.error('Cloudinary error:', errorData);
        errorMessage = errorData.error?.message || errorData.message || errorMessage;
      } catch (e) {
        console.error('Failed to parse Cloudinary error response');
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }

    const cloudinaryData = await cloudinaryResponse.json();

    return NextResponse.json(
      {
        url: cloudinaryData.secure_url,
        publicId: cloudinaryData.public_id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Upload error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
      uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET ? 'Set' : 'Missing',
    });
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
          uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET ? 'Set' : 'Missing',
        } : undefined,
      },
      { status: 500 }
    );
  }
}

