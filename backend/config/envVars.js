import dotenv from "dotenv";


dotenv.config();

export const ENV_VARS = {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT || 4000,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV || 'development',
    MY_EMAIL: process.env.MY_EMAIL,
    MY_PASSWORD: process.env.MY_PASSWORD,
    SESSION_SECRET: process.env.SESSION_SECRET,
}