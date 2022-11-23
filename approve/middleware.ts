import type {Request, Response, NextFunction} from 'express';
import FreetCollection from '../freet/collection';
import ApproveCollection from '../approve/collection';
import DisproveCollection from '../disprove/collection';

/**
 * Checks if the user can approve the freet
 */
export const canUserApprove = async (req: Request, res: Response, next: NextFunction) => {
  const approver = await ApproveCollection.isApprover(req.session.userId, req.body.id);
  const disprover = await DisproveCollection.isDisprover(req.session.userId, req.body.id);
  if (approver || disprover) {
    res.status(403).json({
      error: 'You have already approved this freet or are a disprover.'
    });
    return;
  }

  next();
};

/**
 * Checks if the user can unapprove the freet
 */
export const canUserUnapprove = async (req: Request, res: Response, next: NextFunction) => {
  const {freetId} = req.params;
  const approver = await ApproveCollection.isApprover(req.session.userId, freetId);
  if (!approver) {
    res.status(403).json({
      error: 'You have not approved this freet yet or are a disprover.',
      freetId
    });
    return;
  }

  next();
};

/**
 * Checks if the user has already added 3 unique Approve links to the freet or if they try to add
 * a link they have aleady added before. Also makes sure the user has already approved the freet.
 */
export const canUserAddApproveLink = async (req: Request, res: Response, next: NextFunction) => {
  const link = await ApproveCollection.findApproveLink(req.session.userId, req.body.id, req.body.link);
  const approver = await ApproveCollection.isApprover(req.session.userId, req.body.id);
  if (!approver || link) {
    res.status(403).json({
      error: 'You have already added this approve link to the freet or have already added 3 unique links. In addition you may have not approved the freet yet or are a disprover of this freet.'
    });
    return;
  }

  next();
};

/**
 * Checks if the user can remove an Approve link from the freet
 */
export const canUserRemoveApproveLink = async (req: Request, res: Response, next: NextFunction) => {
  const link = await ApproveCollection.findApproveLink(req.session.userId, req.body.id, req.body.link);
  const approver = await ApproveCollection.isApprover(req.session.userId, req.body.id);
  if (!approver || !link) {
    res.status(403).json({
      error: 'You have not added this approve link to the freet yet.'
    });
    return;
  }

  next();
};

/**
 * Checks if freet has at least one approve link present or if freet is even present
 */
export const isApproveLinksExists = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  if (freet) {
    if (!freet.approveLinks) {
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
