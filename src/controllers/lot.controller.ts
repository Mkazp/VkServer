import { Request, Response } from "express";
import { Lot } from "../models/Lot";
import { Bid } from "../models/Bid";
import { User } from "../models/User";
import { v4 as uuidv4 } from "uuid";
import { sequelize } from "../models";

// Создание нового лота
export const createLot = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      startPrice,
      images,
      endsAt,
      ownerContact,
      ownerId,
    } = req.body;

    const user = await User.findByPk(ownerId);

    if (!user) {
      res.status(404).json({ error: "Пользователь не найден" });
      return;
    }

    const newLot = await Lot.create({
      id: uuidv4(),
      title,
      description,
      startPrice,
      images,
      endsAt,
      ownerId: user.id,
      ownerName: `${user.firstName} ${user.lastName}`,
      ownerContact,
      currentBid: startPrice,
      isFinished: false,
    });

    res.status(201).json(newLot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при создании лота" });
  }
};

// Получение всех лотов
export const getAllLots = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lots = await Lot.findAll({
      include: [
        {
          model: Bid,
          as: "bids",
        },
      ],
    });
    res.status(200).json(lots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при получении лотов" });
  }
};

// Получение одного лота
export const getLotById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const lot = await Lot.findByPk(id, {
      include: [
        {
          model: Bid,
          as: "bids",
        },
      ],
    });

    if (!lot) {
      res.status(404).json({ error: "Лот не найден" });
      return;
    }

    res.status(200).json(lot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при получении лота" });
  }
};

// Обновление лота
// Обновление лота (для обычных изменений)
export const updateLot = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const {
    title,
    description,
    startPrice,
    images,
    endsAt,
    ownerContact,
    ownerId,
  } = req.body;

  try {
    const lot = await Lot.findByPk(id);

    if (!lot) {
      res.status(404).json({ error: "Лот не найден" });
      return;
    }

    if (ownerId !== lot.ownerId) {
      res.status(403).json({ error: "Нет доступа к обновлению этого лота" });
      return;
    }

    // Обновляем информацию о лоте
    Object.assign(lot, {
      title,
      description,
      startPrice,
      images,
      endsAt,
      ownerContact,
    });

    await lot.save();
    res.status(200).json(lot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при обновлении лота" });
  }
};

// ✨ Внесли изменения сюда:
export const updateLotAfterBid = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { currentBid, newBid } = req.body; // Убираем winnerId

  console.log(`Попытка обновить лот с ID: ${id}`); // Логируем ID лота

  const transaction = await sequelize.transaction();

  try {
    // Ищем лот по ID
    const lot = await Lot.findByPk(id, { transaction });

    if (!lot) {
      console.log(`Лот с ID ${id} не найден`); // Логируем, что лот не найден
      await transaction.rollback();
      res.status(404).json({ error: "Лот не найден" });
      return;
    }

    console.log(`Лот с ID ${id} найден, выполняем обновление`); // Логируем, что лот найден

    // 1. Создаем новую ставку
    await Bid.create(
      {
        id: uuidv4(),
        lotId: id,
        userId: newBid.userId,
        amount: newBid.amount,
        time: newBid.time,
        userName: newBid.userName,
        userAvatar: newBid.userAvatar,
      },
      { transaction }
    );

    // 2. Обновляем лот (только текущую ставку)
    lot.currentBid = currentBid; // Обновляем только текущую ставку

    await lot.save({ transaction });

    // 3. Всё прошло успешно — коммитим
    await transaction.commit();

    res.status(200).json(lot); // Отправляем обновленный лот
  } catch (error) {
    console.error("Ошибка при обновлении лота после ставки:", error);

    await transaction.rollback();
    res.status(500).json({ error: "Ошибка при обновлении лота после ставки" });
  }
};

// Удаление лота
export const deleteLot = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { ownerId } = req.body;

  try {
    const lot = await Lot.findByPk(id);

    if (!lot) {
      res.status(404).json({ error: "Лот не найден" });
      return;
    }

    if (ownerId !== lot.ownerId) {
      res.status(403).json({ error: "Нет доступа к удалению этого лота" });
      return;
    }

    await lot.destroy();
    res.status(200).json({ message: "Лот успешно удалён" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при удалении лота" });
  }
};
