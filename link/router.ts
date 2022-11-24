import type {Request, Response} from 'express';
import express from 'express';
import LinkCollection from './collection';
import * as util from './util';
import * as userValidator from '../user/middleware';
import * as linkValidator from './middleware';

const router = express.Router();

/**
 * Add an approve link to a freet.
 *
 * @name POST /api/link/addApproveLink/:freetId?/:url?
 *
 * @param {string} userId - The id of the user that added the link
 * @param {string} freetId - The id of the freet that the link will be added to
 * @param {string} url - The url of the link to be added
 * @return {LinkResponse} - The created approval
 * @throws {403} - If the user is not logged in
 * @throws {404} - If freet does not exist or the user has already added that
 *                 specific link or that user has already added 3 unique links
 */
router.post(
  '/addApproveLink/:freetId?/:url?',
  [
    userValidator.isUserLoggedIn,
    linkValidator.isFreetExists,
    linkValidator.canUserAddApproveLink
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const {url} = req.params;
    const {freetId} = req.params;
    const link = await LinkCollection.findOneLink(url, freetId, true);
    if (link) {
      const updatedLink = await LinkCollection.updateOneApproveLink(userId, url, freetId);
      if (updatedLink) {
        res.status(201).json({
          message: 'You have successfully added an Approve link.',
          updatedLink
        });
      } else {
        res.status(404).json({
          message: 'You are not able to add this Approve link.'
        });
      }
    } else {
      const addedLink = await LinkCollection.addOneApproveLink(userId, url, freetId);
      if (addedLink) {
        res.status(201).json({
          message: 'You have successfully added an Approve link.',
          addedLink
        });
      } else {
        res.status(404).json({
          message: 'You are not able to add this Approve link.'
        });
      }
    }
  }
);

/**
 * Remove an Approve link from a freet.
 *
 * @name DELETE /api/link/removeApproveLink/:freetId?/:url?
 *
 * @param {string} userId - The id of the user that added the link
 * @param {string} freetId - The id of the freet that the link will be removed from
 * @param {string} url - The url of the link to be removed
 * @throws {403} - If the user is not logged in
 * @throws {404} - If freet or link do not exist
 */
router.delete(
  '/removeApproveLink/:freetId?/:url?',
  [
    userValidator.isUserLoggedIn,
    linkValidator.isFreetExists,
    linkValidator.canUserRemoveApproveLink
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const deletedLink = await LinkCollection.deleteOne(userId, req.params.freetId, req.params.url, true);
    if (deletedLink) {
      res.status(201).json({
        message: 'You have successfully removed the Approve link.',
        deletedLink
      });
    }
  }
);

/**
 * Get most popular approve links on a freet sorted from most to least added
 *
 * @name GET /api/link/getMostPopularApproveLinks/:freetId?
 *
 * @return {LinkResponse[]} - A list of all the links sorted in descending order by number of adds
 */
router.get(
  '/getMostPopularApproveLinks/:freetId?',
  async (req: Request, res: Response) => {
    const mostPopularLinks = await LinkCollection.findMostPopularApproveLinks(req.params.freetId);
    const response = mostPopularLinks.map(util.constructLinkResponse);
    res.status(200).json(response);
  }
);

/**
 * Add a Disprove link to a freet.
 *
 * @name POST /api/link/addDisproveLink/:freetId?/:url?
 *
 * @param {string} userId - The if of the user that is adding the link
 * @param {string} freetId - The id of the freet that the link will be added to
 * @param {string} url - The url of the link to be added
 * @return {LinkResponse} - The created disproval
 * @throws {403} - If the user is not logged in
 * @throws {404} - If freet does not exist or the user has already added that
 *                 specific link or that user has already added 3 unique links
 */
router.post(
  '/addDisproveLink/:freetId?/:url?',
  [
    userValidator.isUserLoggedIn,
    linkValidator.isFreetExists,
    linkValidator.canUserAddDisproveLink
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const {url} = req.params;
    const {freetId} = req.params;
    const link = await LinkCollection.findOneLink(url, freetId, true);
    if (link) {
      const updatedLink = await LinkCollection.updateOneDisproveLink(userId, url, freetId);
      if (updatedLink) {
        res.status(201).json({
          message: 'You have successfully added a Disprove link.',
          updatedLink
        });
      } else {
        res.status(404).json({
          message: 'You are not able to add this Disprove link.'
        });
      }
    } else {
      const addedLink = await LinkCollection.addOneDisproveLink(userId, url, freetId);
      if (addedLink) {
        res.status(201).json({
          message: 'You have successfully added a Disprove link.',
          addedLink
        });
      } else {
        res.status(404).json({
          message: 'You are not able to add this Disprove link.'
        });
      }
    }
  }
);

/**
 * Remove a Disprove link from a freet.
 *
 * @name DELETE /api/link/removeDisproveLink/:freetId?/:url?
 *
 * @param {string} userId - The if of the user that added the link
 * @param {string} freetId - The id of the freet that the link will be removed from
 * @param {string} url - The url of the link to be removed
 * @throws {403} - If the user is not logged in
 * @throws {404} - If freet or link do not exist
 */
router.delete(
  '/removeDisproveLink/:freetId?/:url?',
  [
    userValidator.isUserLoggedIn,
    linkValidator.isFreetExists,
    linkValidator.canUserRemoveDisproveLink
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const deletedLink = await LinkCollection.deleteOne(userId, req.params.freetId, req.params.url, false);
    if (deletedLink) {
      res.status(201).json({
        message: 'You have successfully removed the Disprove link.',
        deletedLink
      });
    }
  }
);

/**
 * Get most popular disprove links on a freet sorted from most to least added
 *
 * @name GET /api/link/getMostPopularDisproveLinks/:freetId?
 *
 * @return {LinkResponse[]} - A list of all the freets sorted in descending
 *                             order by number of adds
 */
router.get(
  '/getMostPopularDisproveLinks/:freetId?',
  async (req: Request, res: Response) => {
    const mostPopularLinks = await LinkCollection.findMostPopularDisproveLinks(req.params.freetId);
    const response = mostPopularLinks.map(util.constructLinkResponse);
    res.status(200).json(response);
  }
);

export {router as linkRouter};
