import type {HydratedDocument, Types} from 'mongoose';
import UserModel from '../user/model';
import type {Limit} from './model';
import LimitModel from './model';
class LimitCollection {
  /**
  * Find the specific limit of a user
  *
  * @param {Types.ObjectId | string} userId - The id of the user
  * @return {Promise<HydratedDocument<Limit>> | Promise<null>} - The specific limit, if it exists
  */
  static async findOneLimit(
    userId: Types.ObjectId | string
  ): Promise<HydratedDocument<Limit>> {
    return LimitModel.findOne({userId});
  }

  /**
   * Decrement the user's Fritter Limit by 1 second
   *
   * @param userId id of the user
   * @return {Promise<Boolean>} - true if the limit has been decremented, false otherwise
   */
  static async decrementLimit(
    userId: Types.ObjectId | string
  ): Promise<boolean> {
    const user = await UserModel.findById(userId);
    const tot = user.timeLeft.total - 1;
    const h = Math.floor(tot / 3600);
    const m = Math.floor((tot - (h * 3600)) / 60);
    const s = Math.floor(tot - (h * 3600) - (m * 60));
    user.timeLeft = {
      total: tot,
      hours: h,
      minutes: m,
      seconds: s
    };
    await user.save();
    if (tot > 0) {
      return true;
    }

    return false;
  }

  /**
   * Reset the user's Fritter Limit to 1 hour and updates canPost to True
   *
   * @param userId id of the user
   * @return {Promise<Boolean>} - true if the limit has been reset, false otherwise
   */
  static async resetLimit(
    userId: Types.ObjectId | string
  ): Promise<boolean> {
    const user = await UserModel.findById(userId);
    user.timeLeft = {
      total: 3600,
      hours: 1,
      minutes: 0,
      seconds: 0
    };
    user.canPost = true;
    await user.save();
    if (user) {
      return true;
    }

    return false;
  }

  /**
  * Change the canPost boolean to False after a user publishes a post
  *
  * @param {Types.ObjectId | string} userId - The id of the user
  * @return {Promise<Boolean>} - true if canPost has been changed, false otherwise
  */
  static async updateCanPost(
    userId: Types.ObjectId | string
  ): Promise<boolean> {
    const user = await UserModel.findById(userId);
    user.canPost = false;
    await user.save();
    if (!user.canPost) {
      return true;
    }

    return false;
  }
}

export default LimitCollection;
