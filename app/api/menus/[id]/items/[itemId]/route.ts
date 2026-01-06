import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Menu, { MenuItem } from '@/models/Menu';
import Restaurant from '@/models/Restaurant';

export async function PUT(
  request: Request,
  { params }: { params: { id: string; itemId: string } }
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

    // Verify item belongs to menu
    const itemExists = menu.items.some(
      (itemId: any) => itemId.toString() === params.itemId
    );
    if (!itemExists) {
      return NextResponse.json(
        { error: 'Menu item not found in this menu' },
        { status: 404 }
      );
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

    // Update menu item
    const updateData: any = {
      name,
      description: description || null,
      price: parseFloat(price),
      category: category || null,
      image: image || null,
    };

    // Add translations if provided
    if (Object.keys(translationsMap).length > 0) {
      updateData.translations = translationsMap;
    }

    const menuItem = await MenuItem.findByIdAndUpdate(
      params.itemId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Menu item updated successfully',
        item: {
          _id: menuItem._id,
          name: menuItem.name,
          description: menuItem.description,
          price: menuItem.price,
          category: menuItem.category,
          image: menuItem.image,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Verify item belongs to menu
    const itemExists = menu.items.some(
      (itemId: any) => itemId.toString() === params.itemId
    );
    if (!itemExists) {
      return NextResponse.json(
        { error: 'Menu item not found in this menu' },
        { status: 404 }
      );
    }

    // Remove item from menu
    menu.items = menu.items.filter(
      (itemId: any) => itemId.toString() !== params.itemId
    );
    await menu.save();

    // Delete the menu item
    await MenuItem.findByIdAndDelete(params.itemId);

    return NextResponse.json(
      { message: 'Menu item deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}


