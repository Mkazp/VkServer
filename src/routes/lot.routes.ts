// routes/lot.routes.ts
console.log("rout");
import express from "express";
import {
  createLot,
  getAllLots,
  getLotById,
  updateLot,
  deleteLot,
} from "../controllers/lot.controller";

const router = express.Router();

router.post("/", createLot);
router.get("/", getAllLots);
router.get("/:id", getLotById);
router.put("/:id", updateLot);
// router.post("/:id", createBid);
// router.put("/:id", updateLotAfterBid);
router.delete("/:id", deleteLot);

export default router;
