import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db";
import { Bid } from "./Bid"; // Импорт модели ставки

// Описание атрибутов
interface LotAttributes {
  id: string;
  title: string;
  description: string;
  images: string[];
  startPrice: number;
  currentBid: number;
  endsAt: string;
  isFinished: boolean;
  ownerId: number;
  ownerName: string;
  ownerContact: string;
  winnerId?: number;
}

// Определение полей, которые могут быть опущены при создании
type LotCreationAttributes = Optional<
  LotAttributes,
  "currentBid" | "isFinished" | "winnerId"
>;

// Объявление модели
export class Lot
  extends Model<LotAttributes, LotCreationAttributes>
  implements LotAttributes
{
  declare id: string;
  declare title: string;
  declare description: string;
  declare images: string[];
  declare startPrice: number;
  declare currentBid: number;
  declare endsAt: string;
  declare isFinished: boolean;
  declare ownerId: number;
  declare ownerName: string;
  declare ownerContact: string;
  declare winnerId?: number;

  // Ассоциация с моделью Bid
  static associate() {
    Lot.hasMany(Bid, {
      foreignKey: "lotId",
      as: "bids",
    });
  }
}

// Инициализация модели
Lot.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    startPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currentBid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    endsAt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isFinished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ownerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ownerContact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    winnerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Lot",
    tableName: "lots",
    timestamps: false,
  }
);
