import mongoose from 'mongoose';

// Singleton document holding studio-wide configuration. Always read
// via Settings.getSingleton() so exactly one row ever exists.
const SettingsSchema = new mongoose.Schema(
  {
    key:                { type: String, default: 'global', unique: true },
    announcementBanner: { type: String, default: '' },
    studioName:         { type: String, default: 'Pragya Yoga' },
    supportEmail:       { type: String, default: 'pragyayogaofficial@gmail.com' },
    supportPhone:       { type: String, default: '+91 9675547597' },

    // Integration / system-health flags surfaced on the admin dashboard.
    integrations: {
      paymentGateway: { type: Boolean, default: true },
      zoom:           { type: Boolean, default: true },
      whatsapp:       { type: Boolean, default: true },
      emailSmtp:      { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

SettingsSchema.statics.getSingleton = async function () {
  let doc = await this.findOne({ key: 'global' });
  if (!doc) doc = await this.create({ key: 'global' });
  return doc;
};

const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
export default Settings;
