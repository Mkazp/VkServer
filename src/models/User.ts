import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../db";

// Описание атрибутов
interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  photo: string;
  city?: string;
  balance: number;
  frozenBalance: number;
  myBids: string[]; // Тип должен быть массив строк
}

// Определение полей, которые могут быть опущены при создании
type UserCreationAttributes = Optional<
  UserAttributes,
  "balance" | "frozenBalance" | "myBids" | "city"
>;

// Объявление модели
export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare photo: string;
  declare city?: string;
  declare balance: number;
  declare frozenBalance: number;
  declare myBids: string[]; // Массив строк

  // Метод для проверки и нормализации данных перед сохранением
  static validateMyBids(myBids: string[]): string[] {
    // Фильтруем пустые или некорректные строки
    return myBids.filter((bid) => typeof bid === "string" && bid.trim() !== "");
  }
}

// Инициализация модели
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    photo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    frozenBalance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    myBids: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: false,
  }
);
