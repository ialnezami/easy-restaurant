import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

// Public endpoint for customers to track their order
export async function GET(
  request: Request,
  { params }: { params: { orderNumber: string } }
) {
  try {
    await connectDB();

    const order = await Order.findOne({
      orderNumber: params.orderNumber,
    })
      .populate('restaurant', 'name')
      .populate('assignedStaff', 'name')
      .select('-notes'); // Don't expose internal notes to customers

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

