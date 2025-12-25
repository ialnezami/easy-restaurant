import connectDB from '../lib/mongodb';
import User from '../models/User';
import Restaurant from '../models/Restaurant';
import Menu, { MenuItem } from '../models/Menu';

async function seed() {
  try {
    console.log('🌱 Starting database seed...');
    
    await connectDB();
    console.log('✅ Connected to database');

    // Check if database already has data
    const existingRestaurants = await Restaurant.countDocuments();
    if (existingRestaurants > 0) {
      console.log('⚠️  Database already contains data. Skipping seed.');
      console.log(`   Found ${existingRestaurants} existing restaurant(s).`);
      process.exit(0);
    }

    console.log('📦 Database is empty. Creating seed data...');

    // Create seed users (password will be hashed automatically by User model)
    const seedUser = await User.create({
      name: 'Demo Restaurant Owner',
      email: 'demo@restaurant.com',
      password: 'password123',
      role: 'owner',
    });
    console.log('✅ Created seed user (owner)');

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@restaurant.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('✅ Created admin user');

    const managerUser = await User.create({
      name: 'Manager User',
      email: 'manager@restaurant.com',
      password: 'manager123',
      role: 'manager',
    });
    console.log('✅ Created manager user');

    // Sample restaurants data
    const restaurantsData = [
      {
        name: 'Bella Italia',
        addresses: [
          {
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
          },
        ],
        contactInfo: {
          phone: '(212) 555-0100',
          email: 'info@bellaitalia.com',
          website: 'https://bellaitalia.com',
        },
        menus: [
          {
            name: 'Dinner Menu',
            slug: 'bella-italia-dinner',
            items: [
              {
                name: 'Margherita Pizza',
                description: 'Fresh mozzarella, tomato sauce, basil',
                price: 16.99,
                category: 'Pizza',
              },
              {
                name: 'Spaghetti Carbonara',
                description: 'Creamy pasta with pancetta and parmesan',
                price: 18.99,
                category: 'Pasta',
              },
              {
                name: 'Chicken Parmigiana',
                description: 'Breaded chicken with marinara and mozzarella',
                price: 22.99,
                category: 'Main Course',
              },
              {
                name: 'Tiramisu',
                description: 'Classic Italian dessert',
                price: 8.99,
                category: 'Dessert',
              },
              {
                name: 'Caesar Salad',
                description: 'Romaine lettuce, parmesan, croutons',
                price: 12.99,
                category: 'Salads',
              },
            ],
          },
          {
            name: 'Lunch Menu',
            slug: 'bella-italia-lunch',
            items: [
              {
                name: 'Margherita Pizza (Lunch)',
                description: 'Fresh mozzarella, tomato sauce, basil',
                price: 12.99,
                category: 'Pizza',
              },
              {
                name: 'Penne Arrabbiata',
                description: 'Spicy tomato sauce with garlic',
                price: 14.99,
                category: 'Pasta',
              },
              {
                name: 'Caprese Salad',
                description: 'Fresh mozzarella, tomatoes, basil',
                price: 10.99,
                category: 'Salads',
              },
            ],
          },
        ],
      },
      {
        name: 'Sushi Zen',
        addresses: [
          {
            street: '456 Oak Avenue',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90001',
            country: 'USA',
          },
        ],
        contactInfo: {
          phone: '(323) 555-0200',
          email: 'info@sushizen.com',
          website: 'https://sushizen.com',
        },
        menus: [
          {
            name: 'Main Menu',
            slug: 'sushi-zen-main',
            items: [
              {
                name: 'Salmon Sashimi',
                description: 'Fresh Atlantic salmon, 6 pieces',
                price: 14.99,
                category: 'Sashimi',
              },
              {
                name: 'Dragon Roll',
                description: 'Eel, cucumber, avocado, eel sauce',
                price: 16.99,
                category: 'Rolls',
              },
              {
                name: 'Tuna Nigiri',
                description: 'Premium tuna, 2 pieces',
                price: 8.99,
                category: 'Nigiri',
              },
              {
                name: 'California Roll',
                description: 'Crab, avocado, cucumber',
                price: 7.99,
                category: 'Rolls',
              },
              {
                name: 'Miso Soup',
                description: 'Traditional Japanese soup',
                price: 4.99,
                category: 'Soups',
              },
              {
                name: 'Tempura Shrimp',
                description: 'Crispy fried shrimp, 5 pieces',
                price: 12.99,
                category: 'Appetizers',
              },
            ],
          },
          {
            name: 'Chef\'s Special',
            slug: 'sushi-zen-chefs-special',
            items: [
              {
                name: 'Omakase Set',
                description: 'Chef\'s selection of 12 pieces',
                price: 45.99,
                category: 'Special',
              },
              {
                name: 'Wagyu Beef Roll',
                description: 'Premium wagyu beef, truffle oil',
                price: 28.99,
                category: 'Special',
              },
              {
                name: 'Uni Sashimi',
                description: 'Fresh sea urchin, 3 pieces',
                price: 24.99,
                category: 'Sashimi',
              },
            ],
          },
        ],
      },
      {
        name: 'Burger House',
        addresses: [
          {
            street: '789 Pine Street',
            city: 'Chicago',
            state: 'IL',
            zipCode: '60601',
            country: 'USA',
          },
          {
            street: '321 Elm Boulevard',
            city: 'Chicago',
            state: 'IL',
            zipCode: '60602',
            country: 'USA',
          },
        ],
        contactInfo: {
          phone: '(312) 555-0300',
          email: 'info@burgerhouse.com',
          website: 'https://burgerhouse.com',
        },
        menus: [
          {
            name: 'Classic Menu',
            slug: 'burger-house-classic',
            items: [
              {
                name: 'Classic Burger',
                description: 'Beef patty, lettuce, tomato, onion, pickles',
                price: 11.99,
                category: 'Burgers',
              },
              {
                name: 'Cheeseburger',
                description: 'Classic burger with American cheese',
                price: 12.99,
                category: 'Burgers',
              },
              {
                name: 'Bacon Burger',
                description: 'Burger with crispy bacon and cheese',
                price: 14.99,
                category: 'Burgers',
              },
              {
                name: 'French Fries',
                description: 'Crispy golden fries',
                price: 4.99,
                category: 'Sides',
              },
              {
                name: 'Onion Rings',
                description: 'Beer-battered onion rings',
                price: 5.99,
                category: 'Sides',
              },
              {
                name: 'Chocolate Shake',
                description: 'Rich chocolate milkshake',
                price: 6.99,
                category: 'Beverages',
              },
            ],
          },
          {
            name: 'Gourmet Menu',
            slug: 'burger-house-gourmet',
            items: [
              {
                name: 'Truffle Burger',
                description: 'Wagyu beef, truffle aioli, arugula',
                price: 19.99,
                category: 'Gourmet',
              },
              {
                name: 'BBQ Brisket Burger',
                description: 'Smoked brisket, BBQ sauce, coleslaw',
                price: 17.99,
                category: 'Gourmet',
              },
              {
                name: 'Veggie Burger',
                description: 'Plant-based patty, avocado, sprouts',
                price: 13.99,
                category: 'Vegetarian',
              },
            ],
          },
        ],
      },
      {
        name: 'Café Mocha',
        addresses: [
          {
            street: '555 Coffee Lane',
            city: 'Seattle',
            state: 'WA',
            zipCode: '98101',
            country: 'USA',
          },
        ],
        contactInfo: {
          phone: '(206) 555-0400',
          email: 'hello@cafemocha.com',
        },
        menus: [
          {
            name: 'Coffee Menu',
            slug: 'cafe-mocha-coffee',
            items: [
              {
                name: 'Espresso',
                description: 'Strong Italian coffee',
                price: 3.50,
                category: 'Coffee',
              },
              {
                name: 'Cappuccino',
                description: 'Espresso with steamed milk foam',
                price: 4.50,
                category: 'Coffee',
              },
              {
                name: 'Latte',
                description: 'Espresso with steamed milk',
                price: 4.99,
                category: 'Coffee',
              },
              {
                name: 'Mocha',
                description: 'Chocolate espresso with steamed milk',
                price: 5.50,
                category: 'Coffee',
              },
              {
                name: 'Croissant',
                description: 'Buttery French pastry',
                price: 3.99,
                category: 'Pastries',
              },
              {
                name: 'Blueberry Muffin',
                description: 'Fresh baked with blueberries',
                price: 4.50,
                category: 'Pastries',
              },
            ],
          },
        ],
      },
    ];

    // Create restaurants and menus
    for (const restaurantData of restaurantsData) {
      const { menus, ...restaurantInfo } = restaurantData;
      
      const restaurant = await Restaurant.create({
        ...restaurantInfo,
        owner: seedUser._id,
      });
      console.log(`✅ Created restaurant: ${restaurant.name}`);

      // Create menus for this restaurant
      for (const menuData of menus) {
        const { items, ...menuInfo } = menuData;
        
        const menu = await Menu.create({
          ...menuInfo,
          restaurant: restaurant._id,
          items: [],
        });

        // Create menu items
        const menuItemIds = [];
        for (const itemData of items) {
          const menuItem = await MenuItem.create(itemData);
          menuItemIds.push(menuItem._id);
        }

        // Add items to menu
        menu.items = menuItemIds;
        await menu.save();
        
        console.log(`   ✅ Created menu: ${menu.name} with ${items.length} items`);
      }
    }

    // Assign manager to first restaurant
    if (restaurantsData.length > 0) {
      const firstRestaurant = await Restaurant.findOne({ name: restaurantsData[0].name });
      if (firstRestaurant && managerUser) {
        firstRestaurant.managers = [managerUser._id];
        await firstRestaurant.save();
        console.log(`✅ Assigned manager to ${firstRestaurant.name}`);
      }
    }

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Owner:');
    console.log('     Email: demo@restaurant.com');
    console.log('     Password: password123');
    console.log('   Admin:');
    console.log('     Email: admin@restaurant.com');
    console.log('     Password: admin123');
    console.log('   Manager:');
    console.log('     Email: manager@restaurant.com');
    console.log('     Password: manager123');
    console.log('\n✨ You can now login and explore the sample restaurants!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();

