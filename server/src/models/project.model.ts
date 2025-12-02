import mongoose, { Schema, Model } from "mongoose";

export interface IProject extends mongoose.Document {
  projectId: string;
  name: string;
  description?: string;
  owner: mongoose.Schema.Types.ObjectId;
  keys: {
    privateKey: string;
    publicKey: string;
  };
  authorizedDomains: string[];
  emailNotifications: boolean;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    projectId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    description: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    keys: {
      privateKey: { type: String, required: true },
      publicKey: { type: String, required: true },
    },
    authorizedDomains: { type: [String], default: [] },
    emailNotifications: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);


// indexes for faster queries 
projectSchema.index({ owner: 1 });

// toJSON method to exclude sensitive fields
projectSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.keys.privateKey; // Exclude privateKey
  return obj;
};

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);

export default Project;
