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
  addresses: IAddress[];
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
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
  },
  {
    timestamps: true,
  }
);

const Restaurant: Model<IRestaurant> =
  mongoose.models.Restaurant ||
  mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);

export default Restaurant;


