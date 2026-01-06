import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMenuItem extends Document {
  name: string;
  description?: string;
  price: number;
  category?: string;
  image?: string;
  order: number;
  // Translations: object with language codes as keys
  translations?: {
    name?: { [lang: string]: string };
    description?: { [lang: string]: string };
    category?: { [lang: string]: string };
  };
}

export interface IMenu extends Document {
  restaurant: mongoose.Types.ObjectId;
  name?: string;
  slug: string;
  items: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a menu item name'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
    translations: {
      name: {
        type: Map,
        of: String,
        default: {},
      },
      description: {
        type: Map,
        of: String,
        default: {},
      },
      category: {
        type: Map,
        of: String,
        default: {},
      },
    },
  },
  {
    timestamps: true,
  }
);

const MenuSchema: Schema = new Schema(
  {
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    name: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: 'MenuItem',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create index for restaurant (slug already has unique index)
MenuSchema.index({ restaurant: 1 });

const MenuItem: Model<IMenuItem> =
  mongoose.models.MenuItem ||
  mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);

const Menu: Model<IMenu> =
  mongoose.models.Menu || mongoose.model<IMenu>('Menu', MenuSchema);

export { MenuItem };
export default Menu;


