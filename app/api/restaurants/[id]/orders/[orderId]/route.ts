import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order, { OrderStatus } from '@/models/Order';
import Restaurant from '@/models/Restaurant';

export async function GET(
  request: Request,
  { params }: { params: { id: string; orderId: string } }
) {
  try {
    await connectDB();

    const order = await Order.findOne({
      _id: params.orderId,
      restaurant: params.id,
    })
      .populate('restaurant', 'name')
      .populate('assignedStaff', 'name');

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string; orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Verify restaurant exists and user has access
    const restaurant = await Restaurant.findById(params.id);
    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Check if user is owner or manager
    const isOwner = restaurant.owner.toString() === session.user.id;
    const isManager = restaurant.managers.some(
      (m: any) => m.toString() === session.user.id
    );

    if (!isOwner && !isManager && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const order = await Order.findOne({
      _id: params.orderId,
      restaurant: params.id,
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const body = await request.json();
    const { status, assignedStaff, staffType } = body;

    // Update status
    if (status && Object.values(OrderStatus).includes(status as OrderStatus)) {
      order.status = status as OrderStatus;
      
      // Set completedAt when status is COMPLETED
      if (status === OrderStatus.COMPLETED) {
        order.completedAt = new Date();
      }
    }

    // Update assigned staff
    if (assignedStaff !== undefined) {
      order.assignedStaff = assignedStaff || null;
    }

    // Update staff type
    if (staffType !== undefined) {
      order.staffType = staffType || null;
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('restaurant', 'name')
      .populate('assignedStaff', 'name');

    return NextResponse.json(
      {
        message: 'Order updated successfully',
        order: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

