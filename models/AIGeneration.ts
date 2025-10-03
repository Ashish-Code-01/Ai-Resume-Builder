import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAIGeneration extends Document {
  userId: mongoose.Types.ObjectId;
  resumeId?: mongoose.Types.ObjectId;
  prompt: string;
  response?: string;
  generationType: 'full' | 'section' | 'rewrite' | 'tailor';
  createdAt: Date;
}

const AIGenerationSchema: Schema<IAIGeneration> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeId: {
      type: Schema.Types.ObjectId,
      ref: 'Resume',
    },
    prompt: {
      type: String,
      required: true,
    },
    response: {
      type: String,
    },
    generationType: {
      type: String,
      enum: ['full', 'section', 'rewrite', 'tailor'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

AIGenerationSchema.index({ userId: 1, createdAt: -1 });
AIGenerationSchema.index({ resumeId: 1 });

const AIGeneration: Model<IAIGeneration> =
  mongoose.models.AIGeneration || mongoose.model<IAIGeneration>('AIGeneration', AIGenerationSchema);

export default AIGeneration;
