import type {Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import LimitCollection from './collection';

const router = express.Router();

/**
 * Initialize Fritter Limit for the user
 *
 * @name POST /api/limit/initialize
 *
 * @return {LimitResponse} - The created limit
 * @throws {403} - If the user is not logged
 * @throws {404} - If unable to create Fritter Limit
 */
router.post(
  '/initialize',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const limit = await LimitCollection.addLimit(userId);
    if (limit) {
      res.status(201).json({
        message: 'You have successfully added the Fritter Limit.',
        limit
      });
    } else {
      res.status(404).json({
        message: 'Unable to add the Fritter Limit.'
      });
    }
  }
);

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
    const limit = await LimitCollection.findOne(userId);
    const result = await LimitCollection.resetLimit(userId);
    if (result) {
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
    const limit = await LimitCollection.findOne(userId);
    if (limit) {
      res.status(201).json({
        limit
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
 * @name PUT /api/limit/decrementTimer
 *
 * @return {LimitResponse} - The updated limit
 * @throws {403} - If the user is not logged
 * @throws {404} - If unable to find the Fritter Limit or decrement the timer (reached limit)
 */
router.put(
  '/decrementTimer',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const limit = await LimitCollection.decrementTimer(userId);
    if (limit) {
      if (typeof limit === 'string') {
        res.status(404).json({
          message: 'You have reached your Fritter Limit for the day'
        });
      } else {
        res.status(201).json({
          message: 'You have successfully decremented the Fritter Timer.',
          limit
        });
      }
    } else {
      res.status(404).json({
        message: 'Unable to decrement the Fritter Limit.'
      });
    }
  }
);

export {router as limitRouter};
