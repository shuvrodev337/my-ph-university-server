import app from './app';
import config from './app/config';
import mongoose from 'mongoose';

// Connectivity function
async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    app.listen(config.port, () => {
      console.log(`First Project Copy app listening on  ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

// Connectivity function call
main();
