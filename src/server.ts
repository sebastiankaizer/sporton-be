import "dotenv/config";
import mongoose from "mongoose";
import app from "./app";

const PORT = Number(process.env.PORT) || 5001;
const MONGO_URI = process.env.MONGO_URI;

// Cek dulu variabel env-nya, jangan sampai server jalan tanpa database
if (!MONGO_URI) {
  console.error("Waduh, MONGO_URI belum ada di .env!");
  process.exit(1);
}

const startServer = async () => {
  try {
    // Koneksi ke MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("Mantap! MongoDB sudah tersambung.");

    // Nyalain server
    const server = app.listen(PORT, () => {
      console.log(`Gas! Server jalan di port ${PORT}`);
    });

    // Jaga-jaga kalau ada error yang nggak ketangkep
    process.on("unhandledRejection", (err: any) => {
      console.error(`Ada error yang nggak ketangkep: ${err.message}`);
      server.close(() => process.exit(1));
    });

  } catch (error) {
    console.error("Gagal start server nih:", error);
    process.exit(1);
  }
};

// Panggil fungsi buat jalanin server
startServer();