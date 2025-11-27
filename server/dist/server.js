"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
require("colors");
const routes_1 = __importDefault(require("./routes"));
const db_1 = __importDefault(require("./config/db"));
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "4mb" }));
// app.use(cors({
//     origin: "*",
//     credentials: true, 
// }));
app.use((0, cors_1.default)({
    origin: [
        "https://zad-alamil-shop.vercel.app",
        "http://localhost:3000",
        "http://localhost:5174"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));
// server route
app.get('/', (req, res) => res.send("Zad Alamil server is running"));
app.use('/api/', routes_1.default);
// DB and PORT
(0, db_1.default)();
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`.bgBlue);
});
