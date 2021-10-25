import mongoose from 'mongoose';
import { app } from './app'; 

const start = async () => {
  console.log('starting up auth service');
  if(!process.env.JWT_KEY) {
    throw new Error('JWT env var must be defined'); 
  }
  if(!process.env.MONGO_URI) {
    throw new Error('Mongo uri must be defined'); 
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('connected to mongo db')
  } catch (err) {
    console.log(err);
  }
  app.listen(3000, () => {
    console.log('listent in port 3000!!');
  });
};

start();
