import express , {Request, Response} from 'express'
import cors from 'cors';
import "dotenv/config" ;
import 'colors' ;

import router from './routes';
import connectDB from './config/db';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json({ limit: "4mb"}));
// app.use(cors({
//     origin: "*",
//     credentials: true, 
// }));
app.use(cors({
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
app.get('/', (req: Request, res: Response) => res.send("Zad Alamil server is running"));
app.use('/api/', router)



// DB and PORT
connectDB();
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`.bgBlue)
});

