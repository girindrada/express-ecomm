
import express from "express";
import { 
    getSingle,
    getRange,
 } from "../controllers/statistic.controller.js";
 import { verifyToken } from "../middleware/verifyToken.js"

const router = express.Router();
router.use(verifyToken);

router.get('/single', getSingle);
router.get('/range', getRange);


// export
export default router;