import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';
import UserCollection from '../user/collection';
import LimitCollection from '../limit/collection';

const router = express.Router();

/**
 * Get all the freets
 *
 * @name GET /api/freets
 *
 * @return {FreetResponse[]} - A list of all the freets sorted in descending
 *                      order by date modified
 */
/**
 * Get freets by author.
 *
 * @name GET /api/freets?authorId=id
 *
 * @return {FreetResponse[]} - An array of freets created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }

    const allFreets = await FreetCollection.findAll();
    const response = allFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorFreets = await FreetCollection.findAllByUsername(req.query.author as string);
    const response = authorFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new freet.
 *
 * @name POST /api/freets
 *
 * @param {string} content - The content of the freet
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isValidFreetContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const freet = await FreetCollection.addOne(userId, req.body.content);
    await LimitCollection.updateCanPost(userId);
    const user = await UserCollection.findOneByUserId(userId);
    const {canPost} = user;
    res.status(201).json({
      message: 'Your freet was created successfully.',
      freet: util.constructFreetResponse(freet),
      canPost
    });
  }
);

/**
 * Delete a freet
 *
 * @name DELETE /api/freets/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freet
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier
  ],
  async (req: Request, res: Response) => {
    const {freetId} = req.params;
    await FreetCollection.deleteOne(freetId);
    res.status(200).json({
      message: 'Your freet was deleted successfully.'
    });
  }
);

/**
 * Modify a freet
 *
 * @name PUT /api/freets/:id
 *
 * @param {string} content - the new content for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.put(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    freetValidator.isValidFreetContent
  ],
  async (req: Request, res: Response) => {
    const freet = await FreetCollection.updateOne(req.params.freetId, req.body.content);
    res.status(200).json({
      message: 'Your freet was updated successfully.',
      freet: util.constructFreetResponse(freet)
    });
  }
);

/**
 * Get most liked freets sorted from most to least liked
 *
 * @name GET /api/freets/mostPopular
 *
 * @return {FreetResponse[]} - A list of all the freets sorted in descending
 *                             order by number of likes
 */
router.get(
  '/mostPopular',
  async (req: Request, res: Response) => {
    const mostPopularFreets = await FreetCollection.findMostPopular();
    const response = mostPopularFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  }
);

/**
 * Get most approved freets sorted from most to least approved
 *
 * @name GET /api/freets/mostCredible
 *
 * @return {FreetResponse[]} - A list of all the freets sorted in descending
 *                             order by number of approves
 */
router.get(
  '/mostCredible',
  async (req: Request, res: Response) => {
    const mostCredibleFreets = await FreetCollection.findMostCredible();
    const response = mostCredibleFreets.map(util.constructFreetResponse);
    res.status(200).json(response);
  }
);

export {router as freetRouter};
