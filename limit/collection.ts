import type {HydratedDocument, Types} from 'mongoose';
import type {Limit} from './model';
import FreetModel from '../freet/model';
import LimitModel from './model';
import FreetCollection from '../freet/collection';

class LimitCollection {
  /**
  * Find the specific limit of a user
  *
  * @param {Types.ObjectId | string} userId - The id of the user
  * @return {Promise<HydratedDocument<Limit>> | Promise<null>} - The specific limit, if it exists
  */
  static async findOne(
    userId: Types.ObjectId | string
  ): Promise<HydratedDocument<Limit>> {
    return LimitModel.findOne({userId}).populate('timeLeft');
  }

  /**
  * Initialize the limit object when a user creates an account
  *
  * @param {Types.ObjectId | string} userId - The id of the user
  * @return {Promise<HydratedDocument<Limit>>} - The newly created Limit
  */
  static async addLimit(
    userId: Types.ObjectId | string
  ): Promise<HydratedDocument<Limit>> {
    const limit = new LimitModel({
      userId,
      timeLeft: 3600,
      canPost: true
    });
    await limit.save();
    return limit.populate(['userId', 'timeLeft', 'canPost']);
  }

  /**
  * Reset the timer to 1 hr and canPost to true at the start of a new day
  *
  * @param {Types.ObjectId | string} userId - The id of the user
  * @return {Promise<Boolean>} - true if values reset successfully, false otherwise
  */
  static async resetLimit(
    userId: Types.ObjectId | string
  ): Promise<boolean> {
    const limit = await LimitModel.findOne({userId}).populate('timeLeft');
    if (limit) {
      limit.canPost = true;
      limit.timeLeft = 3600;
      await limit.save();
      return true;
    }

    return false;
  }

  /**
  * Decrement timer every second until it reaches 0 or is paused
  *
  * @param {Types.ObjectId | string} userId - The id of the user
  * @return {Promise<HydratedDocument<Limit> | string>} - The specific limit, else a string response
  */
  static async decrementTimer(
    userId: Types.ObjectId | string
  ): Promise<HydratedDocument<Limit> | string> {
    const limit = await LimitModel.findOne({userId}).populate('timeLeft');
    if (limit.timeLeft === 0) {
      return 'You have reached your Fritter Limit for the day';
    }

    limit.timeLeft -= 1;
    await limit.save();
    return limit;
  }
}

export default LimitCollection;
