import type {Request, Response} from 'express';
import express from 'express';
import DisproveCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as likeValidator from '../like/middleware';
import * as disproveValidator from '../disprove/middleware';
import {constructDisproveResponse, constructLinkResponse} from './util';
import FreetCollection from '../freet/collection';

const router = express.Router();

/**
 * Disprove a freet
 *
 * @name POST /api/disproves
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
 * Remove a Disprove from a freet
 *
 * @name DELETE /api/disproves/:id
 *
 * @return {string} - A success message if the Disprove is removed, otherwise an error message
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
    const disprove = await DisproveCollection.deleteOne(req.session.userId, freetId);
    res.status(200).json({
      message: 'You have successfully removed your disproval from the freet.',
      freetId
    });
  }
);

/**
 * Add a Disprove link to a freet.
 *
 * @name PUT /api/disproves/addLink/:id
 *
 * @param {string} freetId - The freet to add the link to
 * @param {string} url - The link url to be added
 * @return {DisproveResponse} - The created disproval
 * @throws {403} - If the user is not logged in
 * @throws {404} - If freet does not exist or the user has already added that
 *                 specific link or that user has already added 3 unique links
 */
router.put(
  '/addLink/:freetId?',
  [
    userValidator.isUserLoggedIn,
    likeValidator.isFreetExists,
    disproveValidator.canUserAddDisproveLink
  ],
  async (req: Request, res: Response) => {
    const link = await DisproveCollection.addDisproveLink(req.session.userId, req.params.freetId, req.body.link);
    if (link) {
      res.status(201).json({
        message: 'You have successfully added a Disprove link.',
        link
      });
    }
  }
);

/**
 * Remove a Disprove link from a freet.
 *
 * @name PUT /api/disproves/removeLink/:id
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
    disproveValidator.canUserRemoveDisproveLink
  ],
  async (req: Request, res: Response) => {
    const deletedLink = await DisproveCollection.deleteDisproveLink(req.session.userId, req.params.freetId, req.body.link);
    if (deletedLink) {
      res.status(201).json({
        message: 'You have successfully removed a Disprove link.',
        deletedLink
      });
    }
  }
);

/**
 * Get most popular disprove links sorted from most to least popular
 *
 * @name GET /api/disproves/mostPopularLinks/:freetId?
 *
 * @param {string} freetId - The freet which disprove links we are retrieving
 * @return {LinkResponse[]} - A list of all the disprove links sorted in descending order by number of occurrences
 * @throws {403} - If user is not logged in or freet has no disprove links
 * @throws {404} - If freet does not exist
 */
router.get(
  '/mostPopularLinks/:freetId?',
  [
    userValidator.isUserLoggedIn,
    disproveValidator.isDisproveLinksExists
  ],
  async (req: Request, res: Response) => {
    const freet = await FreetCollection.findOne(req.params.freetId);
    const sortedLinkArray = DisproveCollection.findMostPopularLinks(freet._id.toString());
    const response = (await sortedLinkArray).map(link => constructLinkResponse(link, freet.disproveLinks));
    res.status(200).json(response);
  }
);

export {router as disproveRouter};
