import express from "express";
import userRoutes from "./routes/user.routes";
import lotRoutes from "./routes/lot.routes";
import bidRoutes from "./routes/bid.routes";
import { sequelize } from "./db";
import cors from "cors";

// ⬇️ Подключаем модели и ассоциации
import "./models";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/lots", lotRoutes);
app.use("/api/bids", bidRoutes);

export default app;
