import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
    user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    label:  { type: String, required: true },        // e.g. "6-Month Membership"
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['paid', 'pending', 'failed', 'refunded'], default: 'pending', index: true },

    method:        { type: String, enum: ['UPI', 'Bank Transfer', 'Cash', 'Card'], default: 'UPI' },
    transactionId: { type: String, default: '' },
    invoiceNo:     { type: String, unique: true, sparse: true },
    receiptUrl:    { type: String, default: '' },

    date: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

// Auto-generate a human-friendly invoice number on first save.
PaymentSchema.pre('save', async function () {
  if (!this.invoiceNo) {
    const year = (this.date || new Date()).getFullYear();
    const rand = Math.floor(100000 + Math.random() * 900000);
    this.invoiceNo = `INV-${year}-${rand}`;
  }
});

const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
export default Payment;
