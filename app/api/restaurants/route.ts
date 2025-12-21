import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const restaurants = await Restaurant.find({
      owner: session.user.id,
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

