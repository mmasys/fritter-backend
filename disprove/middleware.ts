import type {Request, Response, NextFunction} from 'express';
import DisproveCollection from '../disprove/collection';
import ApproveCollection from '../approve/collection';
import FreetCollection from '../freet/collection';

/**
 * Checks if the user can disprove the freet
 */
export const canUserDisprove = async (req: Request, res: Response, next: NextFunction) => {
  const approver = await ApproveCollection.isApprover(req.session.userId, req.body.id);
  const disprover = await DisproveCollection.isDisprover(req.session.userId, req.body.id);
  if (approver || disprover) {
    res.status(403).json({
      error: 'You have already disproved this freet or are an approver.'
    });
    return;
  }

  next();
};

/**
 * Checks if the user can undisprove the freet
 */
export const canUserUndisprove = async (req: Request, res: Response, next: NextFunction) => {
  const {freetId} = req.params;
  const disprover = await DisproveCollection.isDisprover(req.session.userId, freetId);
  if (!disprover) {
    res.status(403).json({
      error: 'You have not disproved this freet yet.',
      freetId
    });
    return;
  }

  next();
};

/**
 * Checks if the user has already added 3 unique Disprove links to the freet or if they try to add
 * a link they have aleady added before
 */
export const canUserAddDisproveLink = async (req: Request, res: Response, next: NextFunction) => {
  const link = await DisproveCollection.findDisproveLink(req.session.userId, req.body.id, req.body.link);
  const disprover = await DisproveCollection.isDisprover(req.session.userId, req.body.id);
  if (!disprover || link) {
    res.status(403).json({
      error: 'You have already added this disprove link to the freet or have already added 3 unique links or are an approver of this freet.'
    });
    return;
  }

  next();
};

/**
 * Checks if the user can remove a Disprove link from the freet
 */
export const canUserRemoveDisproveLink = async (req: Request, res: Response, next: NextFunction) => {
  const link = await DisproveCollection.findDisproveLink(req.session.userId, req.body.id, req.body.link);
  const disprover = await DisproveCollection.isDisprover(req.session.userId, req.body.id);
  if (!disprover || !link) {
    res.status(403).json({
      error: 'You have not added this disprove link to the freet yet.'
    });
    return;
  }

  next();
};

/**
 * Checks if freet has at least one disprove link present or if freet is even present
 */
export const isDisproveLinksExists = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  if (freet) {
    if (!freet.disproveLinks) {
      res.status(403).json({
        error: 'This freet has no approve links yet.'
      });
      return;
    }
  } else {
    res.status(403).json({
      error: 'This freet has no approve links yet.'
    });
    return;
  }

  next();
};
