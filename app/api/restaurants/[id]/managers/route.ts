import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';
import { getUserPermissions } from '@/lib/permissions';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { managers } = body;

    await connectDB();

    // Check permissions
    const permissions = await getUserPermissions(
      session.user.id,
      session.user.role
    );
    const canManage = await permissions.canManageRestaurant(
      params.id,
      session.user.id
    );

    if (!canManage) {
      return NextResponse.json(
        { error: 'Unauthorized to manage this restaurant' },
        { status: 403 }
      );
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      params.id,
      { managers: managers || [] },
      { new: true }
    );

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Managers updated successfully',
        restaurant: {
          _id: restaurant._id,
          managers: restaurant.managers,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating managers:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}


