import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAddress {
  street: string;
  city: string;
  state?: string;
  zipCode?: string;
  country: string;
}

export interface IRestaurant extends Document {
  name: string;
  owner: mongoose.Types.ObjectId;
  managers: mongoose.Types.ObjectId[];
  addresses: IAddress[];
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
  coverImage?: string; // Main logo/cover image
  images?: string[]; // Array of additional images
  primaryColor?: string; // Primary brand color (hex)
  secondaryColor?: string; // Secondary brand color (hex)
  defaultLanguage?: string; // Default language for this restaurant (e.g., 'en', 'es', 'fr', 'ar')
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema: Schema = new Schema({
  street: {
    type: String,
    required: [true, 'Please provide a street address'],
  },
  city: {
    type: String,
    required: [true, 'Please provide a city'],
  },
  state: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  country: {
    type: String,
    required: [true, 'Please provide a country'],
    default: 'USA',
  },
});

const RestaurantSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a restaurant name'],
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    managers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    addresses: {
      type: [AddressSchema],
      default: [],
    },
    contactInfo: {
      phone: {
        type: String,
      },
      email: {
        type: String,
      },
      website: {
        type: String,
      },
    },
    coverImage: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
    primaryColor: {
      type: String,
      default: '#3B82F6', // Default blue
    },
    secondaryColor: {
      type: String,
      default: '#1E40AF', // Default darker blue
    },
    defaultLanguage: {
      type: String,
      default: 'en', // Default to English
      enum: ['en', 'es', 'fr', 'ar', 'de', 'it', 'pt', 'zh', 'ja', 'ko'],
    },
  },
  {
    timestamps: true,
  }
);

const Restaurant: Model<IRestaurant> =
  mongoose.models.Restaurant ||
  mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);

export default Restaurant;


