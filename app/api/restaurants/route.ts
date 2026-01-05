import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/types/user';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';
import { getUserPermissions } from '@/lib/permissions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Admin can see all restaurants
    if (session.user.role === UserRole.ADMIN) {
      const restaurants = await Restaurant.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ restaurants }, { status: 200 });
    }

    // Owners see their restaurants, managers see restaurants they're assigned to
    const restaurants = await Restaurant.find({
      $or: [
        { owner: session.user.id },
        { managers: session.user.id },
      ],
    }).sort({ createdAt: -1 });

    return NextResponse.json({ restaurants }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const permissions = await getUserPermissions(
      session.user.id,
      session.user.role
    );

    if (!permissions.canCreateRestaurant) {
      return NextResponse.json(
        { error: 'You do not have permission to create restaurants' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, addresses, contactInfo, coverImage, images, primaryColor, secondaryColor } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Restaurant name is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const restaurant = await Restaurant.create({
      name,
      owner: session.user.id,
      managers: [],
      addresses: addresses || [],
      contactInfo: contactInfo || {},
      coverImage: coverImage || null,
      images: images || [],
      primaryColor: primaryColor || '#3B82F6',
      secondaryColor: secondaryColor || '#1E40AF',
    });

    return NextResponse.json(
      {
        message: 'Restaurant created successfully',
        restaurant: {
          _id: restaurant._id,
          name: restaurant.name,
          addresses: restaurant.addresses,
          contactInfo: restaurant.contactInfo,
          coverImage: restaurant.coverImage,
          images: restaurant.images,
          primaryColor: restaurant.primaryColor,
          secondaryColor: restaurant.secondaryColor,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating restaurant:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}


