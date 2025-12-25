import connectDB from '../lib/mongodb';
import User from '../models/User';
import Restaurant from '../models/Restaurant';
import Menu from '../models/Menu';
import { MenuItem } from '../models/Menu';

async function clearSeed() {
  try {
    console.log('🗑️  Clearing seed data...');
    
    await connectDB();
    console.log('✅ Connected to database');

    // Find seed user
    const seedUser = await User.findOne({ email: 'demo@restaurant.com' });
    
    if (!seedUser) {
      console.log('⚠️  No seed data found. Nothing to clear.');
      process.exit(0);
    }

    // Find all restaurants owned by seed user
    const restaurants = await Restaurant.find({ owner: seedUser._id });
    const restaurantIds = restaurants.map(r => r._id);

    // Find all menus for these restaurants
    const menus = await Menu.find({ restaurant: { $in: restaurantIds } });
    const menuIds = menus.map(m => m._id);

    // Get all menu item IDs
    const allMenuItemIds: string[] = [];
    for (const menu of menus) {
      if (menu.items && menu.items.length > 0) {
        allMenuItemIds.push(...menu.items.map((id: any) => id.toString()));
      }
    }

    // Delete menu items
    if (allMenuItemIds.length > 0) {
      await MenuItem.deleteMany({ _id: { $in: allMenuItemIds } });
      console.log(`✅ Deleted ${allMenuItemIds.length} menu items`);
    }

    // Delete menus
    if (menuIds.length > 0) {
      await Menu.deleteMany({ _id: { $in: menuIds } });
      console.log(`✅ Deleted ${menuIds.length} menus`);
    }

    // Delete restaurants
    if (restaurantIds.length > 0) {
      await Restaurant.deleteMany({ _id: { $in: restaurantIds } });
      console.log(`✅ Deleted ${restaurantIds.length} restaurants`);
    }

    // Delete seed user
    await User.findByIdAndDelete(seedUser._id);
    console.log('✅ Deleted seed user');

    console.log('\n✨ Seed data cleared successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing seed data:', error);
    process.exit(1);
  }
}

clearSeed();

