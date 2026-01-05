import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order, { OrderStatus } from '@/models/Order';
import User from '@/models/User';

export async function PUT(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const order = await Order.findById(params.orderId).populate('restaurant');

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Verify user has access to this restaurant
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const restaurant = order.restaurant as any;
    const isOwner = restaurant.owner.toString() === session.user.id;
    const isManager = restaurant.managers.some(
      (m: any) => m.toString() === session.user.id
    );
    const isAssignedStaff = order.assignedStaff?.toString() === session.user.id;

    if (!isOwner && !isManager && !isAssignedStaff) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { status, assign } = body;

    // Assign order to staff
    if (assign === true) {
      order.assignedStaff = session.user.id;
      
      // Auto-set staff type if user has one
      if (user.staffType && user.staffType.length > 0) {
        order.staffType = user.staffType[0]; // Use first staff type
      }
      
      // Change status to PREPARING when assigned
      if (order.status === OrderStatus.PENDING) {
        order.status = OrderStatus.PREPARING;
      }
    }

    // Update status
    if (status && Object.values(OrderStatus).includes(status as OrderStatus)) {
      // Validate status transitions
      const currentStatus = order.status;
      const newStatus = status as OrderStatus;

      // Allow transitions: PENDING -> PREPARING -> READY -> COMPLETED
      const validTransitions: Record<OrderStatus, OrderStatus[]> = {
        [OrderStatus.PENDING]: [OrderStatus.PREPARING],
        [OrderStatus.PREPARING]: [OrderStatus.READY],
        [OrderStatus.READY]: [OrderStatus.COMPLETED],
        [OrderStatus.COMPLETED]: [],
      };

      if (!validTransitions[currentStatus].includes(newStatus)) {
        return NextResponse.json(
          { error: `Invalid status transition from ${currentStatus} to ${newStatus}` },
          { status: 400 }
        );
      }

      order.status = newStatus;

      // Set completedAt when status is COMPLETED
      if (newStatus === OrderStatus.COMPLETED) {
        order.completedAt = new Date();
      }
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

