import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISettings extends Document {
  defaultLanguage: string;
  availableLanguages: string[];
  updatedAt: Date;
}

interface ISettingsModel extends Model<ISettings> {
  getSettings(): Promise<ISettings>;
}

const SettingsSchema: Schema = new Schema(
  {
    defaultLanguage: {
      type: String,
      required: true,
      default: 'en',
    },
    availableLanguages: {
      type: [String],
      required: true,
      default: ['en', 'es', 'fr', 'ar'],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists
SettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    // Default to multiple languages: English, Spanish, French, and Arabic
    settings = await this.create({
      defaultLanguage: 'en',
      availableLanguages: ['en', 'es', 'fr', 'ar'],
    });
  } else {
    // If settings exist but only has English, update it to include more languages
    const defaultLanguages = ['en', 'es', 'fr', 'ar'];
    const hasMultipleLanguages = settings.availableLanguages.some(
      (lang: string) => defaultLanguages.includes(lang) && lang !== 'en'
    );
    
    if (!hasMultipleLanguages && settings.availableLanguages.length <= 1) {
      // Update to include multiple languages
      settings.availableLanguages = defaultLanguages;
      await settings.save();
    }
  }
  return settings;
};

const Settings: ISettingsModel =
  (mongoose.models.Settings as ISettingsModel) || mongoose.model<ISettings, ISettingsModel>('Settings', SettingsSchema);

export default Settings;

