import express from "express";
import { createBid } from "../controllers/bid.controller";

const router = express.Router();

router.post("/", createBid);

export default router;
