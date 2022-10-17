import type {Request, Response, NextFunction} from 'express';
import FreetCollection from '../freet/collection';
import LikeCollection from '../like/collection';

type RequestInformation = 'params' | 'body' | 'query';

/**
 * Determine whether the freet exists
 *
 * @param reqInfoType
 * @returns callback for validation
 */
export const isFreetExist = (reqInfoType: 'params' | 'body' | 'query') => async (req: Request, res: Response, next: NextFunction) => {
  const id = req[reqInfoType].parentId as string;
  const freet = await FreetCollection.findOne(id);
  if (!freet) {
    return res
      .status(404)
      .json({message: `freetId: '${id}' does not exist!`});
  }

  next();
};

/**
 * Determine whether the user has already liked this freet
 *
 * @param reqInfoType
 * @returns callback for validation
 */

export const isLikeExist = (
  reqInfoType: RequestInformation
) => async (req: Request, res: Response, next: NextFunction) => {
  const id = req[reqInfoType].parentId as string;
  const doesExist = await LikeCollection.findByUserId(
    req.session.userId,
    id
  );
  if (doesExist) {
    return res
      .status(404)
      .json({message: 'This freet already has a like.'});
  }

  next();
};
