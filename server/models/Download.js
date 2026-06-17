import mongoose from 'mongoose';

const DownloadSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },     // title
    type:     { type: String, enum: ['pdf', 'video', 'audio', 'guide'], default: 'pdf' },
    size:     { type: String, default: '' },         // display string e.g. "2.4 MB"
    url:      { type: String, required: true },
    category: { type: String, default: 'General' },

    // Visibility tiers mirror the admin "Content Control" screen.
    visibility:   { type: String, enum: ['all', 'plan', 'admin'], default: 'all', index: true },
    allowedPlans: { type: [String], default: [] },

    downloadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Download = mongoose.models.Download || mongoose.model('Download', DownloadSchema);
export default Download;
