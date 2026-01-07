import { Schema, model, models, Document } from 'mongoose';

export interface IAffiliateProduct extends Document {
  name: string;
  price: number;
  currency: string;
  affiliateUrl: string;
  originalUrl: string;
  imageUrl?: string;
  description?: string;
  program: string; // e.g., 'amazon', 'bestbuy'
  lastChecked: Date;
  active: boolean;
  category: string;
  externalId?: string; // Product ID from the affiliate program
}

const productSchema = new Schema<IAffiliateProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  affiliateUrl: { type: String, required: true },
  originalUrl: { type: String, required: true },
  imageUrl: String,
  description: String,
  program: { type: String, required: true },
  lastChecked: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  category: { type: String, index: true },
  externalId: String,
}, { timestamps: true });

// Index for efficient price updates
productSchema.index({ program: 1, externalId: 1 });

export default models.AffiliateProduct || model<IAffiliateProduct>('AffiliateProduct', productSchema);
