import { Schema, Document, model, Types } from 'mongoose';
import { Offer, CITIES, HOUSING_TYPES, AMENITIES } from '../../types/index.js';

export interface OfferDocument extends Omit<Offer, 'host'>, Document {
  host: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const offerSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 20,
    maxlength: 1024,
  },
  postDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  city: {
    type: String,
    required: true,
    enum: CITIES,
  },
  previewImage: {
    type: String,
    required: true,
  },
  photosLinks: {
    type: [String],
    required: true,
    validate: {
      validator: (val: string[]) => val.length === 6,
      message: 'Список фотографий жилья должен содержать ровно 6 изображений',
    },
  },
  isPremium: {
    type: Boolean,
    required: true,
    default: false,
  },
  isFavorite: {
    type: Boolean,
    required: true,
    default: false,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 1,
  },
  housingType: {
    type: String,
    required: true,
    enum: HOUSING_TYPES,
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
  },
  maxGuests: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  price: {
    type: Number,
    required: true,
    min: 100,
    max: 100000,
  },
  amenities: {
    type: [String],
    required: true,
    enum: AMENITIES,
  },
  host: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
}, {
  timestamps: true,
  collection: 'offers',
});

export const OfferModel = model<OfferDocument>('Offer', offerSchema);
