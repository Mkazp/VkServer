import app from "./app";
import { sequelize } from "./db";

const PORT = Number(process.env.PORT) || 3000;

(async () => {
  try {
    console.log("Connecting to DB...");
    sequelize
      .authenticate()
      .then(() => {
        console.log("DB connectedввв");
      })
      .catch((error) => {
        console.error("DB connection error:", error);
      });
    console.log("DB connected");

    console.log("Syncing models with DB...");
    await sequelize.sync(); // Автоматическая синхронизация моделей с базой данных
    console.log("Models synced");

    // Запускаем сервер
    console.log(`Starting server on portе ${PORT}...`);
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
})();
