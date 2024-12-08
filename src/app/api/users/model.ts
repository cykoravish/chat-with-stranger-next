import mongoose from 'mongoose';

// Define the interface for the User document
export interface IUser {
  name: string;
  timestamp: Date;
}

// Create the Mongoose schema
const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  timestamp: {
    type: Date,
    default: () => new Date()
  }
});

// Create and export the model
export const User = mongoose.models?.User || mongoose.model<IUser>('User', userSchema);