import { Request, Response } from "express";
import { Lot } from "../models/Lot";
import { Bid } from "../models/Bid";
import { User } from "../models/User";
import { v4 as uuidv4 } from "uuid";

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

    // Создаем новый лот без поля bids
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

// Получение всех лотов с их ставками
export const getAllLots = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lots = await Lot.findAll({
      include: [
        {
          model: Bid,
          as: "bids", // Подключаем ставки через ассоциацию
        },
      ],
    });
    res.status(200).json(lots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка при получении лотов" });
  }
};

// Получение лота по ID с его ставками
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
          as: "bids", // Подключаем ставки через ассоциацию
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

    // Обновляем только атрибуты лота
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
