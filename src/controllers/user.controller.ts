import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";

// Обработчик асинхронных функций с обработкой ошибок
const asyncHandler =
  (fn: any) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Получение пользователя по ID
export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findByPk(id); // Поиск пользователя по ID
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user); // Возвращаем данные пользователя
});

// Создание или обновление пользователя
export const createOrUpdateUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { id, ...data } = req.body;

    // Преобразуем myBids в строку JSON, если это массив
    if (data.myBids !== undefined && !Array.isArray(data.myBids)) {
      return res.status(400).json({ message: "Invalid myBids format" });
    }

    console.log("Получен req.body:", req.body);

    try {
      // Используем upsert для создания или обновления пользователя
      const [user] = await User.upsert({ id, ...data });
      res.json(user); // Отправляем обновленные или созданные данные пользователя
    } catch (error) {
      console.error("Ошибка при создании/обновлении пользователя:", error);
      res
        .status(500)
        .json({ message: "Ошибка при создании пользователя", error });
    }
  }
);

// Обновление данных пользователя
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, city, photo, balance, frozenBalance, myBids } =
    req.body;

  // Ищем пользователя по ID
  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Обновляем только те поля, которые переданы в запросе
  if (firstName !== undefined) user.firstName = firstName;
  if (lastName !== undefined) user.lastName = lastName;
  if (city !== undefined) user.city = city;
  if (photo !== undefined) user.photo = photo;
  if (balance !== undefined) user.balance = balance;
  if (frozenBalance !== undefined) user.frozenBalance = frozenBalance;
  if (myBids !== undefined) {
    // Преобразуем myBids в строку JSON, если это массив
    // Мы оставляем myBids как массив строк без использования JSON.stringify
    if (Array.isArray(myBids)) {
      user.myBids = myBids; // Просто присваиваем, если это массив
    } else {
      return res.status(400).json({ message: "Invalid myBids format" }); // Ошибка, если это не массив
    }
  }

  console.log("Обновляем пользователя:", user.toJSON());

  // Сохраняем обновленные данные пользователя
  await user.save();

  // Возвращаем обновленного пользователя
  res.json(user);
});

// Обновление баланса пользователя
export const updateBalance = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { amount } = req.body;

    // Находим пользователя по ID
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Обновляем баланс
    user.balance += amount;
    await user.save(); // Сохраняем изменения

    res.json(user); // Отправляем обновленного пользователя
  }
);

// Удаление пользователя
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Удаляем пользователя из базы
  const rowsDeleted = await User.destroy({ where: { id } });

  if (rowsDeleted === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ message: "User deleted" }); // Отправляем подтверждение об удалении
});
