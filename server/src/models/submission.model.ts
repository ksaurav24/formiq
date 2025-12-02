// Submission Model
import { Schema, model, Document } from 'mongoose';

export interface ISubmission extends Document {
    projectId: Schema.Types.ObjectId;
    fields: Record<string, any>;
    ipAddress: string;
    userAgent: string;
    origin: string;
    createdAt: Date;
    updatedAt: Date;
}

const submissionSchema = new Schema<ISubmission>(
    {
        projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
        fields: { type: Object, required: true },
        ipAddress: { type: String, required: true },
        userAgent: { type: String, required: true },
        origin: { type: String, required: true },
    },
    { timestamps: true }
);

// index for efficient querying by projectId and createdAt
submissionSchema.index({ projectId: 1, createdAt: -1 });

// Method to send remove unnecessary fields when returning submission data
submissionSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.ipAddress;
    delete obj.userAgent;
    delete obj.origin;
    delete obj._id;
    delete obj.projectId;
    delete obj.__v;
    return obj;
};

const Submission = model<ISubmission>('Submission', submissionSchema);

export default Submission;
