import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db";
import { Lot } from "./Lot"; // Импорт модели лота

// Описание атрибутов ставки
interface BidAttributes {
  id: string;
  lotId: string; // Внешний ключ на лот
  userId: number;
  userName: string;
  userAvatar: string;
  amount: number;
  time: string;
}

// Определение полей, которые могут быть опущены при создании
type BidCreationAttributes = Optional<BidAttributes, "id">;

// Объявление модели ставки
export class Bid
  extends Model<BidAttributes, BidCreationAttributes>
  implements BidAttributes
{
  declare id: string;
  declare lotId: string;
  declare userId: number;
  declare userName: string;
  declare userAvatar: string;
  declare amount: number;
  declare time: string;

  // Добавляем ассоциацию с моделью Lot
  static associate() {
    Bid.belongsTo(Lot, {
      foreignKey: "lotId", // Внешний ключ
      as: "lot", // Псевдоним для ассоциированного лота
    });
  }
}

// Инициализация модели ставки
Bid.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    lotId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "lots", // связь с моделью лота
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userAvatar: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Bid",
    tableName: "bids",
    timestamps: false,
  }
);
