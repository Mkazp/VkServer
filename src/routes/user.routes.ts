import { Router } from "express";
import {
  getUser,
  createOrUpdateUser,
  updateUser,
  updateBalance,
  deleteUser,
} from "../controllers/user.controller";

const router = Router();

router.get("/:id", getUser);
router.post("/", createOrUpdateUser);
router.patch("/:id", updateUser); // Новый маршрут для обновления данных пользователя
router.patch("/:id/balance", updateBalance);
router.delete("/:id", deleteUser);

export default router;
