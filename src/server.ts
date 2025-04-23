import app from "./app";
import { sequelize } from "./db";

const PORT = Number(process.env.PORT) || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Автоматическая синхронизация моделей с базой данных
    console.log("DB connected");

    // Запускаем сервер
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
})();
