import type {Request, Response, NextFunction} from 'express';
import FollowCollection from '../follow/collection';
import UserCollection from '../user/collection';

/**
 * Check to see that a follow with follower and followee doesn't exist
 */
const isNotFollowing = async (req: Request, res: Response, next: NextFunction) => {
  const followee = await UserCollection.findOneByUsername(req.body.id);

  if (!followee) {
    res.status(403).json({
      error: {
        userNotFound: 'This user does not exist.'
      }
    });
    return;
  }

  const follow = await FollowCollection.findOne(req.session.userId, followee._id);

  if (follow) {
    res.status(403).json({
      error: {
        followFound: 'You already follow this user'
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the user (follower) is following the followee
 */
const isFollowing = async (req: Request, res: Response, next: NextFunction) => {
  const followee = await UserCollection.findOneByUsername(req.body.id);

  if (!followee) {
    res.status(403).json({
      error: {
        userNotFound: 'This user does not exist'
      }
    });
    return;
  }

  const follow = await FollowCollection.findOne(req.session.userId, followee._id);

  if (!follow) {
    res.status(403).json({
      error: {
        followNotFound: 'You do not follow this user'
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the user (followee) exists
 */
const isFolloweeExists = async (req: Request, res: Response, next: NextFunction) => {
  const followee = await UserCollection.findOneByUserId(req.params.followeeId);

  if (!followee) {
    res.status(403).json({
      error: {
        userNotFound: 'This user does not exist.'
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the user (follower) exists
 */
const isFollowerExists = async (req: Request, res: Response, next: NextFunction) => {
  const follower = await UserCollection.findOneByUserId(req.params.followerId);

  if (!follower) {
    res.status(403).json({
      error: {
        userNotFound: 'This user does not exist.'
      }
    });
    return;
  }

  next();
};

export {
  isNotFollowing,
  isFollowing,
  isFolloweeExists,
  isFollowerExists
};
