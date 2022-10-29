import ApproveCollection from '../approve/collection';
import DisproveCollection from '../disprove/collection';
import type {Request, Response, NextFunction} from 'express';
import FreetCollection from '../freet/collection';
import LinkCollection from './collection';

/**
 * Checks if a particular freet exists
 */
export const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  if (!freet) {
    res.status(403).json({
      error: 'This freet does not exist.'
    });
    return;
  }

  next();
};

/**
 * Checks if the user can add an approve link to the freet
 */
export const canUserAddApproveLink = async (req: Request, res: Response, next: NextFunction) => {
  const {userId} = req.session;
  const {freetId} = req.params;
  const link = await LinkCollection.findOneLink(req.params.url, freetId, true);
  const approver = await ApproveCollection.isApprover(userId, freetId);
  if (!approver || link?.users.includes(userId)) {
    res.status(403).json({
      error: 'You have already added this approve link to the freet or have already added 3 unique links. In addition you may have not approved the freet yet or are a disprover of this freet.'
    });
    return;
  }

  next();
};

/**
 * Checks if the user can remove an approve link from the freet
 */
export const canUserRemoveApproveLink = async (req: Request, res: Response, next: NextFunction) => {
  const {userId} = req.session;
  const {freetId} = req.params;
  const link = await LinkCollection.findOneLink(req.params.url, freetId, true);
  const approver = await ApproveCollection.isApprover(userId, freetId);
  if (!approver || !link.users.includes(userId)) {
    res.status(403).json({
      error: 'You have not added this approve link to the freet yet.'
    });
    return;
  }

  next();
};

/**
 * Checks if the user can add a disprove link to the freet
 */
export const canUserAddDisproveLink = async (req: Request, res: Response, next: NextFunction) => {
  const {userId} = req.session;
  const {freetId} = req.params;
  const link = await LinkCollection.findOneLink(req.params.url, freetId, false);
  const disprover = await DisproveCollection.isDisprover(userId, freetId);
  if (!disprover || link?.users.includes(userId)) {
    res.status(403).json({
      error: 'You have already added this disprove link to the freet or have already added 3 unique links. In addition you may have not disproved the freet yet or are an approver of this freet.'
    });
    return;
  }

  next();
};

/**
 * Checks if the user can remove a disprove link from the freet
 */
export const canUserRemoveDisproveLink = async (req: Request, res: Response, next: NextFunction) => {
  const {userId} = req.session;
  const {freetId} = req.params;
  const link = await LinkCollection.findOneLink(req.params.url, freetId, false);
  const disprover = await DisproveCollection.isDisprover(userId, freetId);
  if (!disprover || !link.users.includes(userId)) {
    res.status(403).json({
      error: 'You have not added this disprove link to the freet yet.'
    });
    return;
  }

  next();
};
