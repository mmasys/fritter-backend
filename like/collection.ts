import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import FreetModel from '../freet/model';
import LikeModel from './model';
import FreetCollection from '../freet/collection';

class LikeCollection {
  /**
  * Add a Like to the collection
  *
  * @param {string} likerId - The id of the freet liker
  * @param {string} freetId - The id of the freet
  * @return {Promise<HydratedDocument<Freet>>} - The newly created Freet
  */
  static async addOne(
    likerId: Types.ObjectId | string,
    freetId: Types.ObjectId | string
  ): Promise<HydratedDocument<Like>> {
    const like = new LikeModel({
      likerId,
      freetId
    });
    await FreetCollection.updateLikes(freetId, 1);
    await like.save();
    return like.populate(['likerId', 'freetId']);
  }

  /**
  * Remove a Like from the collection
  *
  * @param {string} likerId - The id of the freet liker
  * @param {string} freetId - The id of the freet
  * @return {Promise<boolean>} - true if the like has been deleted, false otherwise
  */
  static async deleteOne(
    likerId: Types.ObjectId | string,
    freetId: Types.ObjectId | string
  ): Promise<boolean> {
    const deletedLike = await LikeModel.deleteOne({
      likerId,
      freetId
    });
    if (deletedLike) {
      await FreetCollection.updateLikes(freetId, -1);
    }

    return deletedLike !== null;
  }

  /**
   * Get a like by freetId and userId
   *
   * @param {string} likerId - The id of the freet liker
   * @param {string} freetId - The id of the freet
   * @return {Promise<boolesn>} - true if the user has liked the freet, false otherwise
   */
  static async findLike(
    likerId: Types.ObjectId | string,
    freetId: Types.ObjectId | string
  ): Promise<boolean> {
    const like = await LikeModel.findOne({likerId, freetId});
    const freet = await FreetModel.findOne({_id: freetId});
    if (freet && like) {
      return true;
    }

    return false;
  }

  /**
   * Get all freets that a user has liked
   *
   * @param {string} userId - The id of the user
   * @return {Promise<Array<HydratedDocument<Like>>>} - An array of all of the user's liked freets
   */
  static async findUserLikedFreets(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Like>>> {
    return LikeModel.find({likerId: userId}).populate('freetId likerId');
  }
}

export default LikeCollection;
