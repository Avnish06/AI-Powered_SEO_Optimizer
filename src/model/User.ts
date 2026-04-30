import {
  Schema,
  model,
  models,
  InferSchemaType,
  HydratedDocument,
} from "mongoose";

const Userschema = new Schema(
  {
 
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
      default: "",
    },
    phone: {
      type: String,
      required: false,
      trim: true,
      unique: true,
    },
    accountType: {
      type: String,
      enum: ["INDIVIDUAL", "ORGANIZATION"],
      default: "INDIVIDUAL",
    },
    fullName: {
      type: String,
      trim: true,
    },
    organizationName: {
      type: String,
      trim: true,
    },
    provider: {
      type: String,
      default: "credentials",
    },
  },
  { timestamps: true },
);
// Auto-generated TypeScript type from schema
export type UserType = InferSchemaType<typeof Userschema>;

// Full MongoDB document type
export type UserDocument = HydratedDocument<UserType>;

const User = models.User || model<UserType>("User", Userschema);

export default User;
