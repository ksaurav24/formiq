

import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
  },
  subject: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 120,
  },
  category: {
    type: String,
    enum: ["billing", "technical", "account", "feedback", "other"],
    required: true,
  },
  priority: {
    type: String,
    enum: ["low", "normal", "high", "urgent"],
    required: true,
  },
    projectId: {
    type: String,
    default: null,
  },
    url: {
    type: String,
    default: null,
  },
    description: {
    type: String,
    required: true,
    minlength: 10,
    },
    steps: {
    type: String,
    default: null,
    },
    expected: {
    type: String,
    default: null,
    },
    actual: {
    type: String,
    default: null,
    },
    subscribe: {
    type: Boolean,
    default: true,
    },
    consent: {
    type: Boolean,
    required: true,
    validate: {
      validator: (v: boolean) => v === true,
      message: "You must consent to be contacted",
    },
    },
    status: {
    type: String,
    enum: ["open", "in_progress", "resolved"],
    default: "open",
    },
}, {
  timestamps: true,
});

// indexes for faster queries
ticketSchema.index({ email: 1 });


const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);

export default Ticket;