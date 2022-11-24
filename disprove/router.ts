import type {Request, Response} from 'express';
import express from 'express';
import DisproveCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as likeValidator from '../like/middleware';
import * as disproveValidator from '../disprove/middleware';
import {constructDisproveResponse} from './util';

const router = express.Router();

/**
 * Disprove a freet.
 *
 * @name POST /api/disproves/addDisprove
 *
 * @param {string} freetId - The freet to be disproved
 * @return {DisproveResponse} - The created disproval
 * @throws {403} - If the user is not logged in
 * @throws {404} - If freet does not exist or already disproved
 */
router.post(
  '/addDisprove',
  [
    userValidator.isUserLoggedIn,
    likeValidator.isFreetExists,
    disproveValidator.canUserDisprove
  ],
  async (req: Request, res: Response) => {
    const disprove = await DisproveCollection.addOne(req.session.userId, req.body.id);
    if (disprove) {
      res.status(201).json({
        message: 'You have successfully disproved the freet.',
        disprove: constructDisproveResponse(disprove)
      });
    }
  }
);

/**
 * Remove a disprove from a freet
 *
 * @name DELETE /api/disproves/removeDisprove/:id
 *
 * @return {string} - A success message if the disprove is removed, otherwise an error message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If freet does not exist or disprove does not exist on that freet
 */
router.delete(
  '/removeDisprove/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    disproveValidator.canUserUndisprove
  ],
  async (req: Request, res: Response) => {
    const {freetId} = req.params;
    await DisproveCollection.deleteOne(req.session.userId, freetId);
    res.status(200).json({
      message: 'You have successfully removed your disproval from the freet.',
      freetId
    });
  }
);

export {router as disproveRouter};
