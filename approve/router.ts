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
 * @name DELETE /api/approves/:id
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
    const approve = await ApproveCollection.deleteOne(req.session.userId, freetId);
    res.status(200).json({
      message: 'You have successfully removed your approval from the freet.',
      freetId
    });
  }
);

/**
 * Add an Approve link to a freet.
 *
 * @name PUT /api/approves/addLink/:id
 *
 * @param {string} freetId - The freet to add the link to
 * @param {string} url - The link url to be added
 * @return {ApproveResponse} - The created approval
 * @throws {403} - If the user is not logged in
 * @throws {404} - If freet does not exist or the user has already added that
 *                 specific link or that user has already added 3 unique links
 */
router.put(
  '/addLink/:freetId?',
  [
    userValidator.isUserLoggedIn,
    likeValidator.isFreetExists,
    approveValidator.canUserAddApproveLink
  ],
  async (req: Request, res: Response) => {
    const link = await ApproveCollection.addApproveLink(req.session.userId, req.params.freetId, req.body.link);
    if (link) {
      res.status(201).json({
        message: 'You have successfully added an Approve link.',
        link
      });
    }
  }
);

/**
 * Remove an Approve link from a freet.
 *
 * @name PUT /api/approves/removeLink/:id
 *
 * @param {string} freetId - The freet to remove the link from
 * @param {string} url - The link url to be removed
 * @throws {403} - If the user is not logged in
 * @throws {404} - If freet or link do not exist
 */
router.put(
  '/removeLink/:freetId?',
  [
    userValidator.isUserLoggedIn,
    likeValidator.isFreetExists,
    approveValidator.canUserRemoveApproveLink
  ],
  async (req: Request, res: Response) => {
    const deletedLink = await ApproveCollection.deleteApproveLink(req.session.userId, req.params.freetId, req.body.link);
    if (deletedLink) {
      res.status(201).json({
        message: 'You have successfully removed an Approve link.',
        deletedLink
      });
    }
  }
);

export {router as approveRouter};
