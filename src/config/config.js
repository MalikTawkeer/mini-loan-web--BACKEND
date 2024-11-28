export const conf = {
    PORT: process.env.PORT,
  
    DB_URL: String(process.env.DB_URL),
    DB_NAME: String(process.env.DB_NAME),
  
    JWT_SECRET_KEY: String(process.env.JWT_SECRET_KEY),
  
    NODEMAILER_GMAIL: String(process.env.GMAIL),
    NODEMAILER_PASSWORD: String(process.env.PASSWORD),
  };

  