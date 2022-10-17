import FreetCollection from 'freet/collection';
import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';

class LikeCollection {
  /**
  * Add a Like to the collection
  *
  * @param {string} userId - The id of the user
  * @param {string} freetId - The id of the freet
  * @return {Promise<HydratedDocument<Like>>} - The newly created Like
  */
  static async addOne(
    userId: Types.ObjectId | string,
    freetId: Types.ObjectId | string
  ): Promise<HydratedDocument<Like>> {
    const Like = new LikeModel({
      userId,
      freetId
    });
    await FreetCollection.changeLikes(freetId, 1);
    await Like.save();
    return Like.populate('userId');
  }

  /**
  * Delete a Like by id
  *
  * @param {string} userId - The id of user
  * @param {string} freetId - The id of the freet
  * @return {Promise<Boolean>} - true if the Like has been deleted, false otherwise
  */
  static async deleteOne(
    userId: Types.ObjectId | string,
    freetId: Types.ObjectId | string
  ): Promise<boolean> {
    const deletedLike = await LikeModel.findOneAndDelete({
      userId,
      freetId
    });
    if (deletedLike !== null) {
      await FreetCollection.changeLikes(freetId, -1);
    }

    return deletedLike !== null;
  }

  /**
   * Delete entries for user
   *
   * @param {string} freetId - The id of the freet
   * @returns true if success else false
   */
  static async deleteMany(freetId: Types.ObjectId | string): Promise<boolean> {
    const deleted = await LikeModel.deleteMany({freetId});
    return deleted !== null;
  }

  /**
   * Determine if a user has liked an item
   *
   * @param {string} userId - The id of the user
   * @param {string} freetId - The id of the freet
   *
   * @return {Promise<boolean>}
   */
  static async findByUserId(
    userId: Types.ObjectId | string,
    freetId: Types.ObjectId | string
  ): Promise<boolean> {
    return (await LikeModel.findOne({userId, freetId})) !== null;
  }
}

export default LikeCollection;
