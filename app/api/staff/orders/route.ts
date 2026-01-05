import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order, { OrderStatus } from '@/models/Order';
import User from '@/models/User';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get user with staff info
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const staffType = searchParams.get('staffType');
    const restaurantId = searchParams.get('restaurantId');

    // Build query
    const query: any = {};

    // Filter by restaurant if user has one assigned
    if (user.restaurant) {
      query.restaurant = user.restaurant;
    } else if (restaurantId) {
      query.restaurant = restaurantId;
    } else {
      // If no restaurant assigned, return empty (staff must be assigned to restaurant)
      return NextResponse.json({ orders: [] }, { status: 200 });
    }

    // Filter by assigned staff or unassigned orders
    if (staffType && user.staffType && user.staffType.includes(staffType)) {
      query.$or = [
        { assignedStaff: session.user.id },
        { assignedStaff: null, staffType: staffType },
      ];
    } else {
      query.assignedStaff = session.user.id;
    }

    // Filter by status
    if (status && Object.values(OrderStatus).includes(status as OrderStatus)) {
      query.status = status;
    }

    // Don't show completed orders by default
    if (!status) {
      query.status = { $ne: OrderStatus.COMPLETED };
    }

    const orders = await Order.find(query)
      .populate('restaurant', 'name')
      .populate('assignedStaff', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching staff orders:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

