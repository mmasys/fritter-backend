import type {HydratedDocument, Types} from 'mongoose';
import type {Follow} from './model';
import FollowModel from './model';

class FollowCollection {
/**
 * Add a Follow to the collection
 *
 * @param {string} followerId - The id of the user who will follow
 * @param {string} followeeId - The id of the user who will be followed
 * @return {Promise<HydratedDocument<Follow>>} - The newly created Follow
 */
  static async addOne(
    followerId: Types.ObjectId | string,
    followeeId: Types.ObjectId | string
  ): Promise<HydratedDocument<Follow>> {
    const Follow = new FollowModel({
      followerId,
      followeeId
    });
    await Follow.save();
    return Follow.populate(['followerId', 'followeeId']);
  }

  /**
   * Find a Follow with followerId and followeeId
   *
   * @param {string} followerId - The id of the user that is following
   * @param {string} followeeId - The id of the user that is being followed
   * @return {Promise<HydratedDocument<Follow>> | Promise<null> } - The Follow between the users, if it exists
   */
  static async findOne(
    followerId: Types.ObjectId | string,
    followeeId: Types.ObjectId | string
  ): Promise<HydratedDocument<Follow>> {
    return FollowModel.findOne({followerId, followeeId}).populate(['followerId', 'followeeId']);
  }

  /**
   * Delete a Follow with followerId and followeeId
   *
   * @param {string} followerId - The id of the user that is following
   * @param {string} followeeId - The id of the user that is being followed
   * @return {Promise<Boolean>} - true if the Follow has been deleted, false otherwise
   */
  static async deleteOne(
    followerId: Types.ObjectId | string,
    followeeId: Types.ObjectId | string
  ): Promise<boolean> {
    const Follow = await FollowModel.deleteOne({followerId, followeeId});
    return Follow !== null;
  }

  /**
   * Get all the followers who are following the user with followeeId
   *
   * @param {string} followeeId - The id of the user whose followers we are finding
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the follow objects
   */
  static async getAllFollowers(
    followeeId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Follow>>> {
    return FollowModel.find({followeeId}).populate(['followerId', 'followeeId']);
  }

  /**
   * Get all the users that the user with followerId is following
   *
   * @param {string} followerId - The id of the user whose followees we are finding
   * @return {Promise<HydratedDocument<Follow>[]>} - An array of all of the follow objects
   */
  static async getAllFollowing(
    followerId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Follow>>> {
    return FollowModel.find({followerId}).populate(['followerId', 'followeeId']);
  }
}

export default FollowCollection;
