import type {Request, Response} from 'express';
import express from 'express';
import ApproveCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as likeValidator from '../like/middleware';
import * as approveValidator from '../approve/middleware';
import {constructApproveResponse} from './util';

const router = express.Router();

/**
 * Approve a freet.
 *
 * @name POST /api/approves/addApprove
 *
 * @param {string} freetId - The freet to be approved
 * @return {ApproveResponse} - The created approval
 * @throws {403} - If the user is not logged in
 * @throws {404} - If freet does not exist or already approved
 */
router.post(
  '/addApprove',
  [
    userValidator.isUserLoggedIn,
    likeValidator.isFreetExists,
    approveValidator.canUserApprove
  ],
  async (req: Request, res: Response) => {
    const approve = await ApproveCollection.addOne(req.session.userId, req.body.id);
    if (approve) {
      res.status(201).json({
        message: 'You have successfully approved the freet.',
        approve: constructApproveResponse(approve)
      });
    }
  }
);

/**
 * Remove an approve from a freet
 *
 * @name DELETE /api/approves/removeApprove/:id
 *
 * @return {string} - A success message if the approve is removed, otherwise an error message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If freet does not exist or approve does not exist on that freet
 */
router.delete(
  '/removeApprove/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    approveValidator.canUserUnapprove
  ],
  async (req: Request, res: Response) => {
    const {freetId} = req.params;
    await ApproveCollection.deleteOne(req.session.userId, freetId);
    res.status(200).json({
      message: 'You have successfully removed your approval from the freet.',
      freetId
    });
  }
);

export {router as approveRouter};
