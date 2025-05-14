const mongoose = require('mongoose');

const connectDB = async () => {
  try {
<<<<<<< HEAD
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
=======
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
>>>>>>> 6ba3e94c1d6e0527e84738647d2976ce7c797a94
    process.exit(1);
  }
};

module.exports = connectDB;
