// routes/lot.routes.ts
import express from "express";
import {
  createLot,
  getAllLots,
  getLotById,
  updateLot,
  updateLotAfterBid,
  deleteLot,
} from "../controllers/lot.controller";

const router = express.Router();

router.post("/", createLot);
router.get("/", getAllLots);
router.get("/:id", getLotById);
router.put("/:id", updateLot);
router.patch("/:id", updateLotAfterBid);
router.delete("/:id", deleteLot);

export default router;
