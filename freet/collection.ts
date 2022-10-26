import type {HydratedDocument, Types} from 'mongoose';
import type {Freet} from './model';
import FreetModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class FreetCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} content - The id of the content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(authorId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Freet>> {
    const date = new Date();
    const freet = new FreetModel({
      authorId,
      dateCreated: date,
      content,
      dateModified: date,
      likes: 0,
      approves: 0,
      disproves: 0,
      approveLinks: {},
      disproveLinks: {},
      approvers: {},
      disprovers: {},
      uniqueUserApproveLinks: [],
      uniqueUserDisproveLinks: []
    });
    await freet.save(); // Saves freet to MongoDB
    return freet.populate('authorId');
  }

  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    return FreetModel.findOne({_id: freetId}).populate('authorId');
  }

  /**
   * Get all the freets in the database, sorted from most to least recent
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAll(): Promise<Array<HydratedDocument<Freet>>> {
    return FreetModel.find({}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the freets in by given author, sorted from most to least recent
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Freet>>> {
    const author = await UserCollection.findOneByUsername(username);
    return FreetModel.find({authorId: author._id}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Update a freet with the new content
   *
   * @param {string} freetId - The id of the freet to be updated
   * @param {string} content - The new content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
   */
  static async updateOne(freetId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Freet>> {
    const freet = await FreetModel.findOne({_id: freetId});
    freet.content = content;
    freet.dateModified = new Date();
    await freet.save();
    return freet.populate('authorId');
  }

  /**
   * Delete a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const freet = await FreetModel.deleteOne({_id: freetId});
    return freet !== null;
  }

  /**
   * Delete all the freets by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await FreetModel.deleteMany({authorId});
  }

  /**
   * Update the number of likes on a freet
   *
   * @param freetId id of the freet
   * @param change 1 or -1, either increment or decrement the like count
   */
  static async updateLikes(
    freetId: Types.ObjectId | string,
    change: 1 | -1
  ): Promise<void> {
    const freet = await FreetModel.findById(freetId);
    freet.likes += change;
    await freet.save();
  }

  /**
   * Update the number of approves or disproves on a freet
   *
   * @param userId id of the user
   * @param freetId id of the freet
   * @param change 1 or -1, either increment or decrement the approve count
   * @param isApprove true if approve, false if disprove
   */
  static async updateApprovesOrDisproves(
    userId: Types.ObjectId,
    freetId: Types.ObjectId | string,
    change: 1 | -1,
    isApprove: boolean
  ): Promise<void> {
    const freet = await FreetModel.findById(freetId);

    if (isApprove) {
      freet.approves += change;
      if (change === 1) {
        freet.approvers.set(userId, []);
      } else {
        freet.approveLinks.forEach((count, link) => {
          if (freet.approvers.get(userId).includes(link)) {
            if (count === 0) {
              freet.approveLinks.delete(link);
            } else {
              count -= 1;
            }
          }
        });

        freet.uniqueUserApproveLinks.forEach((uniqueId, link) => {
          if (freet.approvers.get(userId).includes(link)) {
            freet.uniqueUserApproveLinks.delete(uniqueId);
          }
        });
        freet.approvers.delete(userId);
      }
    } else {
      freet.disproves += change;
      if (change === 1) {
        freet.disprovers.set(userId, []);
      } else {
        freet.disproveLinks.forEach((count, link) => {
          if (freet.disprovers.get(userId).includes(link)) {
            if (count === 0) {
              freet.disproveLinks.delete(link);
            } else {
              count -= 1;
            }
          }
        });
        freet.disprovers.delete(userId);
      }
    }

    await freet.save();
  }

  /**
   * Add an Approve or Disprove Link to a freet
   *
   * @param userId id of the freet approver/disprover
   * @param freetId id of the freet
   * @param link the link url
   * @param isApprove true if approve, false if disprove
   */
  static async addLink(
    userId: Types.ObjectId | string,
    freetId: Types.ObjectId | string,
    link: string,
    isApprove: boolean
  ): Promise<void> {
    const freet = await FreetModel.findById(freetId);
    const uniqueId = link + userId.toString();
    const uniqueLinks = isApprove ? freet.uniqueUserApproveLinks : freet.uniqueUserDisproveLinks;
    const userLinkCount = isApprove ? freet.approvers : freet.disprovers;
    const totalLinkCount = isApprove ? freet.approveLinks : freet.disproveLinks;
    uniqueLinks.set(uniqueId, link);

    userLinkCount.set(userId, userLinkCount.get(userId).concat([link]));

    if (totalLinkCount.has(link)) {
      totalLinkCount.set(link, totalLinkCount.get(link) + 1);
    } else {
      totalLinkCount.set(link, 1);
    }

    await freet.save();
  }

  /**
   * Remove an Approve or Disprove Link from a freet
   *
   * @param userId id of the freet approver/disprover
   * @param freetId id of the freet
   * @param link the link url
   * @param isApprove true if approve, false if disprove
   */
  static async removeLink(
    userId: Types.ObjectId,
    freetId: Types.ObjectId | string,
    link: string,
    isApprove: boolean
  ): Promise<void> {
    const freet = await FreetModel.findById(freetId);
    const uniqueId = link + userId.toString();
    const uniqueLinks = isApprove ? freet.uniqueUserApproveLinks : freet.uniqueUserDisproveLinks;
    const userLinkCount = isApprove ? freet.approvers : freet.disprovers;
    const totalLinkCount = isApprove ? freet.approveLinks : freet.disproveLinks;

    if (isApprove) {
      freet.uniqueUserApproveLinks.delete(uniqueId);
    } else {
      freet.uniqueUserDisproveLinks.delete(uniqueId);
    }

    const newUserIdLinkCount = userLinkCount.get(userId).filter(l => l !== link);

    userLinkCount.set(userId, newUserIdLinkCount);

    if (totalLinkCount.get(link) === 1) {
      totalLinkCount.delete(link);
    } else {
      totalLinkCount.set(link, totalLinkCount.get(link) - 1);
    }

    await freet.save();
  }
}

export default FreetCollection;
