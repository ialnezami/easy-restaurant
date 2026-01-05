import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order, { OrderStatus } from '@/models/Order';
import Restaurant from '@/models/Restaurant';
import Menu, { MenuItem } from '@/models/Menu';

// Generate unique order number per restaurant
async function generateOrderNumber(restaurantId: string): Promise<string> {
  await connectDB();
  
  // Get today's date in YYYYMMDD format
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
  
  // Count orders for this restaurant today
  const todayStart = new Date(today.setHours(0, 0, 0, 0));
  const todayEnd = new Date(today.setHours(23, 59, 59, 999));
  
  const count = await Order.countDocuments({
    restaurant: restaurantId,
    createdAt: { $gte: todayStart, $lte: todayEnd },
  });
  
  // Format: DATE-ORDER_NUMBER (e.g., 20240101-001)
  // Order numbers are unique per restaurant due to compound index
  const orderNum = String(count + 1).padStart(3, '0');
  return `${dateStr}-${orderNum}`;
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items, customerName, customerPhone, tableNumber, notes } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'At least one item is required' },
        { status: 400 }
      );
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

    // Validate and calculate total
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      if (!item.menuItem || !item.quantity) {
        return NextResponse.json(
          { error: 'Invalid item data' },
          { status: 400 }
        );
      }

      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return NextResponse.json(
          { error: `Menu item ${item.menuItem} not found` },
          { status: 404 }
        );
      }

      const itemTotal = menuItem.price * item.quantity;
      totalPrice += itemTotal;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        notes: item.notes || null,
      });
    }

    // Generate order number
    const orderNumber = await generateOrderNumber(params.id);

    // Create order
    const order = await Order.create({
      restaurant: params.id,
      orderNumber,
      customerName: customerName || null,
      customerPhone: customerPhone || null,
      tableNumber: tableNumber || null,
      items: orderItems,
      status: OrderStatus.PENDING,
      totalPrice,
      notes: notes || null,
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('restaurant', 'name')
      .populate('assignedStaff', 'name');

    return NextResponse.json(
      {
        message: 'Order created successfully',
        order: populatedOrder,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const staffType = searchParams.get('staffType');

    // Build query - always filter by restaurant
    const query: any = { restaurant: params.id };

    if (status && Object.values(OrderStatus).includes(status as OrderStatus)) {
      query.status = status;
    }

    if (staffType) {
      query.staffType = staffType;
    }

    const orders = await Order.find(query)
      .populate('restaurant', 'name')
      .populate('assignedStaff', 'name')
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

