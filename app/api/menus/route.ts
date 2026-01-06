import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Menu from '@/models/Menu';
import Restaurant from '@/models/Restaurant';
import { generateMenuToken } from '@/lib/utils';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { restaurantId, name, slug } = body;

    if (!restaurantId || !slug) {
      return NextResponse.json(
        { error: 'Restaurant ID and slug are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify restaurant ownership
    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      owner: session.user.id,
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found or unauthorized' },
        { status: 404 }
      );
    }

    // Check if slug already exists
    const existingMenu = await Menu.findOne({ slug });
    if (existingMenu) {
      return NextResponse.json(
        { error: 'A menu with this slug already exists' },
        { status: 400 }
      );
    }

    // Generate unique token
    let token: string;
    let tokenExists = true;
    while (tokenExists) {
      token = crypto.randomBytes(16).toString('hex');
      const existingToken = await Menu.findOne({ token });
      if (!existingToken) {
        tokenExists = false;
      }
    }

    const menu = await Menu.create({
      restaurant: restaurantId,
      name: name || null,
      slug,
      token: token!,
      items: [],
    });

    return NextResponse.json(
      {
        message: 'Menu created successfully',
        menu: {
          _id: menu._id,
          name: menu.name,
          slug: menu.slug,
          token: menu.token,
          restaurant: menu.restaurant,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating menu:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}



