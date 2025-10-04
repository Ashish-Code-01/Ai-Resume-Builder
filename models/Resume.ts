import mongoose, { Schema, Document, Model } from "mongoose";
import User  from "@/models/User";

export interface IResumeContent {
  personalInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
    summary?: string;
  };
  experience?: Array<{
    id: string;
    company: string;
    position: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description: string;
    achievements?: string[];
  }>;
  education?: Array<{
    id: string;
    institution: string;
    degree: string;
    field?: string;
    location?: string;
    startDate: string;
    endDate?: string;
    gpa?: string;
    description?: string;
  }>;
  skills?: Array<{
    id: string;
    category: string;
    items: string[];
  }>;
  projects?: Array<{
    id: string;
    name: string;
    description: string;
    technologies?: string[];
    link?: string;
    startDate?: string;
    endDate?: string;
  }>;
  certifications?: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    expirationDate?: string;
    credentialId?: string;
  }>;
}

export interface ICanvasLayout {
  width?: number;
  height?: number;
  backgroundColor?: string;
  sections?: Array<{
    id: string;
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
    padding?: number;
    visible?: boolean;
  }>;
}

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: IResumeContent;
  canvasLayout: ICanvasLayout;
  isPublic: boolean;
  publicSlug?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema: Schema<IResume> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: Schema.Types.Mixed,
      default: {},
    },
    canvasLayout: {
      type: Schema.Types.Mixed,
      default: {
        width: 816,
        height: 1056,
        backgroundColor: "#ffffff",
        sections: [],
      },
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    publicSlug: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

ResumeSchema.index({ userId: 1, createdAt: -1, publicSlug: 1 });

const Resume: Model<IResume> =
  mongoose.models.Resume || mongoose.model<IResume>("Resume", ResumeSchema);

export default Resume;
