import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import LikeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as middleware from './middleware';

const router = express.Router();

/**
 * Check if the user has liked the freet
 *
 * @name GET /api/likes?freetId=id
 * @param {string} freetId the id of the freet
 *
 * @return {boolean} - whether the user has liked the freet
 * @throws {400} - If freetId is not given
 * @throws {403} if user is not logged in
 * @throws {404} if freet does not exist
 *
 */
router.get(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    middleware.isFreetExist('query')
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const exists = await LikeCollection.findByUserId(
      userId,
      req.query.parentId as string
    );
    res.status(200).json({exists});
  }
);

/**
 * Create a new like.
 *
 * @name POST /api/likes
 *
 * @param {string} freetId - the id of the freet
 * @return {HydratedDocument<Like>} - The created like
 * @throws {403} - If the user is not logged in
 * @throws {404} if the freet does not exist, or already liked
 */
router.post(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    middleware.isFreetExist('body'),
    middleware.isLikeExist('body')
  ],
  async (req: Request, res: Response) => {
    const userId = req.session.userId as string;
    const freetId = req.body as string;
    const like = await LikeCollection.addOne(userId, freetId);
    res.status(201).json({
      message: 'You have successfully liked the freet!',
      like
    });
  }
);

/**
 * Delete a like
 *
 * @name DELETE /api/likes/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the liker
 * @throws {400} - if the like id is not supplied
 */
router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    middleware.isFreetExist('body'),
    middleware.isLikeExist('body')
  ],
  async (req: Request, res: Response) => {
    const {freetId} = req.params;
    const userId = req.session.userId as string;
    await LikeCollection.deleteOne(userId, freetId);
    res.status(200).json({
      message: 'You have successfully removed your like from the freet!'
    });
  }
);

export {router as likeRouter};
