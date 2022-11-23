import type {Request, Response} from 'express';
import express from 'express';
import FollowCollection from './collection';
import * as userValidator from '../user/middleware';
import * as followValidator from '../follow/middleware';
import {constructFollowResponse, getUserFreets} from './util';
import UserCollection from '../user/collection';

const router = express.Router();

/**
 * Follow another user
 *
 * @name POST /api/follow
 * @param {string} follower - The username of the user that will follow
 * @param {string} followee - The username of the user to be followed
 * @return {FollowResponse} - The created follow
 * @throws {403} - If the user is not logged in, or the follow already exists
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    followValidator.isNotFollowing
  ],
  async (req: Request, res: Response) => {
    const follower = await UserCollection.findOneByUserId(req.session.userId as string);
    const followee = await UserCollection.findOneByUsername(req.body.id as string);

    const follow = await FollowCollection.addOne(follower._id, followee._id);
    res.status(201).json({
      message: `You have successfully followed ${followee.username}.`,
      follow: constructFollowResponse(follow)
    });
  }
);

/**
 * Unfollow a user
 *
 * @name DELETE /api/follow/followerId/followeeId
 *
 * @return {string} - A success message if the unfollow was successful
 * @throws {403} - If the user is not logged in or the follow doesn't exist
 */
router.delete(
  '/:followerId?/:followeeId?',
  [
    userValidator.isUserLoggedIn,
    followValidator.isFollowing
  ],
  async (req: Request, res: Response) => {
    const follower = await UserCollection.findOneByUserId(req.session.userId as string);
    const followee = await UserCollection.findOneByUsername(req.body.id as string);
    await FollowCollection.deleteOne(follower._id, followee._id);

    res.status(200).json({
      message: `You have successfully unfollowed ${followee.username}.`
    });
  }
);

/**
 * Get all of the users that follow this user
 *
 * @name GET /api/follow/getFollowers/followeeId?
 *
 * @return {FollowResponse[]} - An array of follows who are following the followee
 * @throws {404} - If no user with the followee username exists
 *
 */
router.get(
  '/getFollowers/:followeeId?',
  [
    followValidator.isFolloweeExists
  ],
  async (req: Request, res: Response) => {
    const allFollowers = await FollowCollection.getAllFollowers(req.params.followeeId);
    const followerResponse = allFollowers.map(constructFollowResponse);
    res.status(200).json(followerResponse);
  }
);

/**
 * Get all of the users that this user is following
 *
 * @name GET /api/follow/getFollowing/:followerId?
 *
 * @return {FollowResponse[]} - An array of people who the user follows
 * @throws {404} - If no user with the user's username exists
 */
router.get(
  '/getFollowing/:followerId?',
  [
    followValidator.isFollowerExists
  ],
  async (req: Request, res: Response) => {
    const allFollowing = await FollowCollection.getAllFollowing(req.params.followerId);
    const followingResponse = allFollowing.map(constructFollowResponse);
    res.status(200).json(followingResponse);
  }
);

/**
 * Get the feed that contains freets from people the user follows
 *
 * @name GET /api/follow/feed/:userId?
 *
 * @return {FreetResponse[]} - An array of freets from people the user follows
 * @throws {403} - If the user is not logged in
 */
router.get(
  '/feed/:userId?',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const {userId} = req.params;
    const allFollowing = await FollowCollection.getAllFollowing(userId);
    const feed = await Promise.all(allFollowing.map(getUserFreets));
    res.status(200).json(feed);
  }
);

export {router as followRouter};
