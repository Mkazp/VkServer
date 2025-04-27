console.log("SERVER IS STARTING");
import express from "express";
import userRoutes from "./routes/user.routes";
import lotRoutes from "./routes/lot.routes";
import bidRoutes from "./routes/bid.routes";
import { sequelize } from "./db";
import cors from "cors";

// ⬇️ Подключаем модели и ассоциации
import "./models";

const app = express();

// Настроим CORS:
app.use(
  cors({
    origin: "*", // Разрешить запросы с любых доменов
    credentials: true, // Разрешить отправку куки/заголовков авторизации
  })
);
app.use(express.json());
console.log("log app");
app.get("/", (req, res) => {
  res.send("Сервер работает");
});
app.use((req, res, next) => {
  console.log("===> Новый запрос:", req.method, req.originalUrl);
  next();
});

app.use("/api/users", userRoutes);
app.use("/api/lots", lotRoutes);
app.use("/api/bids", bidRoutes);

export default app;
