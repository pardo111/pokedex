import { Router } from "express";
import { getPoke } from "../controllers/poke.controller.js";

const router = Router();
router.get("/pokemon", getPoke);

export default router;