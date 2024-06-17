import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  return {
    uri: `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,
    user: process.env.MONGO_USERNAME,
    pass: process.env.MONGO_PASSWORD,
    dbName: process.env.MONGO_DB_NAME,
  };
});
