import { sequelize } from "../db";
import { Lot } from "./Lot";
import { Bid } from "./Bid";

// Вызываем методы associate у моделей
Lot.associate();
Bid.associate();

// Экспортируем модели и sequelize
export { sequelize, Lot, Bid };
