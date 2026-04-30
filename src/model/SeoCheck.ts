import mongoose, { Schema, Document } from "mongoose";

export interface ISeoCheck extends Document {
  url: string;
  score: number;
  onPageScore: number;
  technicalScore: number;
  contentScore: number;
  performanceScore: number;
  linksScore: number;
  details: any;
  userId: mongoose.Types.ObjectId;
  checkedAt: Date;
}

const SeoCheckSchema: Schema = new Schema({
  url: { type: String, required: true },
  score: { type: Number, required: true },
  onPageScore: { type: Number, default: 0 },
  technicalScore: { type: Number, default: 0 },
  contentScore: { type: Number, default: 0 },
  performanceScore: { type: Number, default: 0 },
  linksScore: { type: Number, default: 0 },
  details: { type: Schema.Types.Mixed },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  checkedAt: { type: Date, default: Date.now },
});

export default mongoose.models.SeoCheck || mongoose.model<ISeoCheck>("SeoCheck", SeoCheckSchema);
