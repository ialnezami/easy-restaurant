import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Menu, { MenuItem } from '@/models/Menu';
import Restaurant from '@/models/Restaurant';

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
    const { name, description, price, category, image, translations } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify menu ownership
    const menu = await Menu.findById(params.id).populate('restaurant');
    if (!menu) {
      return NextResponse.json({ error: 'Menu not found' }, { status: 404 });
    }

    const restaurant = await Restaurant.findById(menu.restaurant);
    if (restaurant?.owner.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Prepare translations as Maps (MongoDB schema expects Map)
    const translationsMap: any = {};
    if (translations) {
      if (translations.name) {
        translationsMap.name = new Map(Object.entries(translations.name));
      }
      if (translations.description) {
        translationsMap.description = new Map(Object.entries(translations.description));
      }
      if (translations.category) {
        translationsMap.category = new Map(Object.entries(translations.category));
      }
    }

    // Create menu item
    const menuItemData: any = {
      name,
      description: description || null,
      price: parseFloat(price),
      category: category || null,
      image: image || null,
    };

    // Add translations if provided
    if (Object.keys(translationsMap).length > 0) {
      menuItemData.translations = translationsMap;
    }

    const menuItem = await MenuItem.create(menuItemData);

    // Add item to menu
    menu.items.push(menuItem._id);
    await menu.save();

    return NextResponse.json(
      {
        message: 'Menu item created successfully',
        item: {
          _id: menuItem._id,
          name: menuItem.name,
          description: menuItem.description,
          price: menuItem.price,
          category: menuItem.category,
          image: menuItem.image,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}



