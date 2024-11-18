import mongoose from 'mongoose';

let isConnected = false;

export async function dbConnect() {
  if (isConnected) {
    console.log('=> Using existing database connection');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = db.connections[0].readyState;
    console.log('=> Successfully connected to the database');
  } catch (error) {
    console.error('=> Error connecting to the database:', error);
    throw new Error('Database connection failed');
  }
}