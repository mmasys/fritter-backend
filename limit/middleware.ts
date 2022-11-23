import type {Request, Response, NextFunction} from 'express';
import LimitCollection from './collection';

/**
 * Checks if a limit with userId exists
 */
const isLimitExists = async (req: Request, res: Response, next: NextFunction) => {
  const limit = await LimitCollection.findOneLimit(req.session.userId);
  if (limit) {
    res.status(404).json({
      message: 'This user already has an initialized limit'
    });
    return;
  }

  next();
};

export {
  isLimitExists
};

