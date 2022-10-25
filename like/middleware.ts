import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import LikeCollection from '../like/collection';

/**
 * Checks if the freet exists
 */
export const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const freetId = req.body.id as string;
  const validFormat = Types.ObjectId.isValid(freetId);
  const freet = validFormat ? await FreetCollection.findOne(freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `The freet with freet ID ${freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the user can like the freet
 */
export const canUserLike = async (req: Request, res: Response, next: NextFunction) => {
  const like = await LikeCollection.findLike(req.session.userId, req.body.id);
  if (like) {
    res.status(403).json({
      error: 'You have already liked this freet.'
    });
    return;
  }

  next();
};

/**
 * Checks if the user can unlike the freet
 */
export const canUserUnlike = async (req: Request, res: Response, next: NextFunction) => {
  const {freetId} = req.params;
  const like = await LikeCollection.findLike(req.session.userId, freetId);
  if (!like) {
    res.status(403).json({
      error: 'You have not liked this freet yet.',
      freetId
    });
    return;
  }

  next();
};
