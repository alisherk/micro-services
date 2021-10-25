import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

//in case if code below complates on integration of payments
/*
  declare global {
    var signin: () => string[]; 
  }
*/

//make a change to exisitng NodeJS global object
declare global {
  namespace NodeJS {
    interface Global {
      signup(): string[];
    }
  }
}

jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri() as string;

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signup = () => {

  //build a jwt payload, { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com"
  }

  //create the jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!); 

  //build a session object { jwt: MY_JWT}
  const session = { jwt: token }

  //turn thet session into JSON 
  const sessionJSON = JSON.stringify(session); 

  //take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  //return a string that is cookie with the encoded data 
  return [`express:sess=${base64}`];
};
