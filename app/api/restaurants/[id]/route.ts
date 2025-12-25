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
    const { name, addresses, contactInfo } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Restaurant name is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const restaurant = await Restaurant.findOne({
      _id: params.id,
      owner: session.user.id,
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found or unauthorized' },
        { status: 404 }
      );
    }

    restaurant.name = name;
    restaurant.addresses = addresses || [];
    restaurant.contactInfo = contactInfo || {};
    await restaurant.save();

    return NextResponse.json(
      {
        message: 'Restaurant updated successfully',
        restaurant: {
          _id: restaurant._id,
          name: restaurant.name,
          addresses: restaurant.addresses,
          contactInfo: restaurant.contactInfo,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating restaurant:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
        { error: 'Unauthorized to delete this restaurant' },
        { status: 403 }
      );
    }

    const restaurant = await Restaurant.findById(params.id);

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    await Restaurant.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: 'Restaurant deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting restaurant:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
