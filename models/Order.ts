import mongoose, { Schema, Document, Model } from 'mongoose';

export enum OrderStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  READY = 'ready',
  COMPLETED = 'completed',
}

export interface IOrderItem {
  menuItem: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface IOrder extends Document {
  restaurant: mongoose.Types.ObjectId;
  orderNumber: string;
  customerName?: string;
  customerPhone?: string;
  tableNumber?: string;
  items: IOrderItem[];
  status: OrderStatus;
  assignedStaff?: mongoose.Types.ObjectId;
  staffType?: string;
  totalPrice: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

const OrderItemSchema = new Schema({
  menuItem: {
    type: Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  notes: String,
});

const OrderSchema = new Schema(
  {
    restaurant: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    orderNumber: {
      type: String,
      required: true,
      index: true,
    },
    customerName: String,
    customerPhone: String,
    tableNumber: String,
    items: [OrderItemSchema],
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
      index: true,
    },
    assignedStaff: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    staffType: String,
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    notes: String,
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Compound index for restaurant + orderNumber (unique per restaurant)
OrderSchema.index({ restaurant: 1, orderNumber: 1 }, { unique: true });
OrderSchema.index({ restaurant: 1, status: 1 });
OrderSchema.index({ assignedStaff: 1, status: 1 });

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;

