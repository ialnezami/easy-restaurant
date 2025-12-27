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
      default: ['en'],
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
    settings = await this.create({
      defaultLanguage: 'en',
      availableLanguages: ['en'],
    });
  }
  return settings;
};

const Settings: ISettingsModel =
  (mongoose.models.Settings as ISettingsModel) || mongoose.model<ISettings, ISettingsModel>('Settings', SettingsSchema);

export default Settings;

