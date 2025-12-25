import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/models/User';
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

    const body = await request.json();
    const { name, addresses, contactInfo } = body;

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
      addresses: addresses || [],
      contactInfo: contactInfo || {},
    });

    return NextResponse.json(
      {
        message: 'Restaurant created successfully',
        restaurant: {
          _id: restaurant._id,
          name: restaurant.name,
          addresses: restaurant.addresses,
          contactInfo: restaurant.contactInfo,
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


