import type {Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as limitValidator from './middleware';
import UserCollection from '../user/collection';
import LimitCollection from './collection';

const router = express.Router();

/**
 * Reset timer to 1 hr and canPost to true.
 *
 * @name PUT /api/limit/reset
 *
 * @return {LimitResponse} - The created limit
 * @throws {403} - If the user is not logged
 * @throws {404} - If unable to reset timer/canPost
 */
router.put(
  '/reset',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    await LimitCollection.resetLimit(userId);
    const user = await UserCollection.findOneByUserId(userId);
    const limit = user.timeLeft;
    if (limitValidator.isLimitExists) {
      res.status(201).json({
        message: 'You have successfully reset the Fritter Limit.',
        limit
      });
    } else {
      res.status(404).json({
        message: 'Unable to reset the Fritter Limit.'
      });
    }
  }
);

/**
 * Get Fritter Limit for specific user.
 *
 * @name GET /api/limit/getLimit
 *
 * @return {LimitResponse} - The limit
 * @throws {403} - If the user is not logged
 * @throws {404} - If unable to find the Fritter Limit
 */
router.get(
  '/getLimit',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const user = await UserCollection.findOneByUserId(userId);
    const limit = user.timeLeft;
    const {canPost} = user;
    if (limit) {
      res.status(201).json({
        limit,
        canPost
      });
    } else {
      res.status(404).json({
        message: 'Unable to find the Fritter Limit.'
      });
    }
  }
);

/**
 * Decrement Fritter Limit timer of specific user.
 *
 * @name PUT /api/limit/decrementLimit
 *
 * @return {LimitResponse} - The updated limit
 * @throws {403} - If the user is not logged
 * @throws {404} - If unable to find the Fritter Limit or decrement the timer (reached limit)
 */
router.put(
  '/decrementLimit',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const result = await LimitCollection.decrementLimit(userId);
    const user = await UserCollection.findOneByUserId(userId);
    const limit = user.timeLeft;
    if (result) {
      res.status(201).json({
        message: 'You have successfully decremented the Fritter Timer.',
        limit
      });
    } else {
      res.status(404).json({
        message: 'You have reached your Fritter Limit for the day.'
      });
    }
  }
);

export {router as limitRouter};
