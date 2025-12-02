import app from './app';
import logger from './lib/logger';
import dotenv from 'dotenv';
import connectDB from './lib/database'; 


dotenv.config();

const PORT = process.env.PORT || 3000;
// a instant execution function to connect to DB and start the server
(async () => {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT} | http://localhost:${PORT}`);
  });
})();