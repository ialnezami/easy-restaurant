# Database Seed Scripts

This directory contains scripts for seeding the database with sample data.

## Seed Script

The seed script (`seed.ts`) creates sample restaurants with menus and menu items if the database is empty.

### Features

- ✅ Only seeds if database is empty (checks for existing restaurants)
- ✅ Creates a demo user account
- ✅ Creates 4 sample restaurants:
  - **Bella Italia** - Italian restaurant with 2 menus (Dinner & Lunch)
  - **Sushi Zen** - Japanese restaurant with 2 menus (Main & Chef's Special)
  - **Burger House** - Burger restaurant with 2 menus (Classic & Gourmet) and 2 locations
  - **Café Mocha** - Coffee shop with 1 menu
- ✅ Each restaurant has multiple menus
- ✅ Each menu has multiple menu items with categories

### Usage

Run the seed script:
```bash
npm run seed
```

The script will:
1. Check if the database is empty
2. If empty, create sample data
3. If not empty, skip seeding (to prevent overwriting existing data)

### Demo Credentials

After seeding, you can login with:
- **Email**: `demo@restaurant.com`
- **Password**: `password123`

## Clear Seed Script

The clear seed script (`clear-seed.ts`) removes all seed data from the database.

### Usage

Clear seed data:
```bash
npm run seed:clear
```

This will:
1. Find the demo user (`demo@restaurant.com`)
2. Delete all restaurants owned by the demo user
3. Delete all menus and menu items associated with those restaurants
4. Delete the demo user

## Notes

- The seed script is safe to run multiple times - it will only seed if the database is empty
- Use `seed:clear` to remove seed data before re-seeding
- Seed data is useful for development, testing, and demonstrations
- Make sure your MongoDB connection is configured in `.env.local` before running


