import app from './app';
import config from './app/config';
import mongoose from 'mongoose';
import { Server } from 'http';

let server: Server;
// Connectivity function
async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    server = app.listen(config.port, () => {
      console.log(`My PH University server app listening on  ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

// Connectivity function call
main();

// Handle unhandledRejection -> Produced asynchronously , ex: Promise.reject();
process.on('unhandledRejection', (err) => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
  if (server) {
    server.close(() => {
      process.exit(1); // gracefully closing process
    });
  }
  process.exit(1);
});
// Handle uncaughtException -> Produced synchronously ex: console.log(a);
process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1); // abruptly closing process
});
