"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const PORT = Number(process.env.PORT) || 5001;
const MONGO_URI = process.env.MONGO_URI;
// Cek dulu variabel env-nya, jangan sampai server jalan tanpa database
if (!MONGO_URI) {
    console.error("Waduh, MONGO_URI belum ada di .env!");
    process.exit(1);
}
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Koneksi ke MongoDB
        yield mongoose_1.default.connect(MONGO_URI);
        console.log("Mantap! MongoDB sudah tersambung.");
        // Nyalain server
        const server = app_1.default.listen(PORT, () => {
            console.log(`Gas! Server jalan di port ${PORT}`);
        });
        // Jaga-jaga kalau ada error yang nggak ketangkep
        process.on("unhandledRejection", (err) => {
            console.error(`Ada error yang nggak ketangkep: ${err.message}`);
            server.close(() => process.exit(1));
        });
    }
    catch (error) {
        console.error("Gagal start server nih:", error);
        process.exit(1);
    }
});
// Panggil fungsi buat jalanin server
startServer();
