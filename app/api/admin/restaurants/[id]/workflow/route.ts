import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/types/user';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Only admins can manage workflow settings' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { workflowEnabled } = body;

    if (typeof workflowEnabled !== 'boolean') {
      return NextResponse.json(
        { error: 'workflowEnabled must be a boolean' },
        { status: 400 }
      );
    }

    await connectDB();

    const restaurant = await Restaurant.findById(params.id);

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    restaurant.workflowEnabled = workflowEnabled;
    await restaurant.save();

    return NextResponse.json(
      {
        message: 'Workflow status updated successfully',
        restaurant: {
          _id: restaurant._id,
          name: restaurant.name,
          workflowEnabled: restaurant.workflowEnabled,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating workflow status:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

