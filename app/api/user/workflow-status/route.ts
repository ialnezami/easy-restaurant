import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ hasWorkflowAccess: false }, { status: 200 });
    }

    await connectDB();

    // Check if user has access to any restaurant with workflow enabled
    const restaurants = await Restaurant.find({
      $or: [
        { owner: session.user.id },
        { managers: session.user.id },
      ],
      workflowEnabled: true,
    }).limit(1);

    const hasWorkflowAccess = restaurants.length > 0;

    return NextResponse.json({ hasWorkflowAccess }, { status: 200 });
  } catch (error: any) {
    console.error('Error checking workflow status:', error);
    return NextResponse.json({ hasWorkflowAccess: false }, { status: 200 });
  }
}

