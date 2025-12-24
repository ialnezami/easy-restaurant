# Easy Restaurant

A digital menu management platform that allows restaurant owners to create and manage menus with QR code access for customers.

## Features

- **User Authentication**: Secure registration and login system
- **Restaurant Management**: Create and manage multiple restaurants
- **Menu Management**: Create menus with items, categories, and pricing
- **QR Code Generation**: Generate QR codes for easy menu access
- **Public Menu View**: Beautiful, responsive menu display for customers

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **QR Code**: qrcode library

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd easy-restaurant
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/easy-restaurant
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/easy-restaurant

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-a-random-string
```

To generate a secure `NEXTAUTH_SECRET`, you can run:
```bash
openssl rand -base64 32
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
easy-restaurant/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Dashboard page
│   ├── menu/            # Public menu view
│   ├── menus/           # Menu management
│   └── restaurants/     # Restaurant management
├── components/          # React components
├── lib/                 # Utility functions
├── models/             # MongoDB models
└── types/              # TypeScript type definitions
```

## Usage

### Creating a Restaurant

1. Sign up or log in to your account
2. Navigate to Dashboard
3. Click "Create New Restaurant"
4. Fill in restaurant details (name, address, contact info)
5. Save the restaurant

### Creating a Menu

1. Go to your restaurant's detail page
2. Click "Create New Menu"
3. Enter a menu name and unique slug
4. The slug will be used in the menu URL (e.g., `/menu/your-slug`)

### Adding Menu Items

1. Go to your menu management page
2. Click "Add Item"
3. Fill in item details:
   - Name (required)
   - Description (optional)
   - Price (required)
   - Category (optional)
   - Image URL (optional)
4. Save the item

### Generating QR Code

1. On the menu management page, you'll see a QR code in the sidebar
2. The QR code links to your public menu
3. Click "Download QR Code" to save it as an image
4. Print or display the QR code for customers to scan

### Viewing Public Menu

Customers can access the menu by:
- Scanning the QR code
- Visiting the menu URL directly: `http://localhost:3000/menu/[slug]`

## API Routes

- `POST /api/auth/register` - User registration
- `POST /api/restaurants` - Create restaurant
- `GET /api/restaurants` - Get user's restaurants
- `POST /api/menus` - Create menu
- `POST /api/menus/[id]/items` - Add menu item

## Database Models

- **User**: User accounts with authentication
- **Restaurant**: Restaurant information and ownership
- **Menu**: Menu with unique slug
- **MenuItem**: Individual menu items with pricing and categories

## Development

### Running in Development Mode

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NEXTAUTH_URL` | Base URL of your application | Yes |
| `NEXTAUTH_SECRET` | Secret key for NextAuth.js | Yes |

## Future Features

- Order management system
- Employee accounts
- AI chatbot for menu recommendations
- Image upload functionality
- Menu analytics
- Multi-language support

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


