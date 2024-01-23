import { Router } from 'express';
import issueTokenController, { renewTokenController } from '../controllers/TokenControllers';
import addUserController from '../controllers/addUserController';

export const router = Router();

router.post("/add", addUserController);
router.post("/issue-token", issueTokenController);
router.get("/renew-token", renewTokenController);