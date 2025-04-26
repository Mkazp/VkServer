import app from "./app";
import { sequelize } from "./db";

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("DB connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1); // <-- если ошибка, выходим с ошибкой
  }
}

startServer();
