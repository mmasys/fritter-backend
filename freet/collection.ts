import type {HydratedDocument, Types} from 'mongoose';
import type {Freet} from './model';
import FreetModel from './model';
import UserCollection from '../user/collection';
import LinkCollection from '../link/collection';

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
   * Get all the freets in the database, sorted from most to least number of likes
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the most popular freets
   */
  static async findMostPopular(): Promise<Array<HydratedDocument<Freet>>> {
    return FreetModel.find({}).sort({likes: -1}).populate('authorId');
  }

  /**
   * Get all the freets in the database, sorted from most to least number of approves
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the most approved freets
   */
  static async findMostCredible(): Promise<Array<HydratedDocument<Freet>>> {
    return FreetModel.find({}).sort({approves: -1}).populate('authorId');
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
   * Update the approve or disprove count of a freet
   *
   * @param userId id of the user
   * @param freetId id of the freet
   * @param change 1 or -1, either increment or decrement the like count
   * @param isApprove true if we are updating the approve count, false otherwise
   */
  static async updateApproveOrDisprove(
    userId: Types.ObjectId | string,
    freetId: Types.ObjectId | string,
    change: 1 | -1,
    isApprove: boolean
  ): Promise<void> {
    const freet = await FreetModel.findById(freetId);
    if (isApprove) {
      freet.approves += change;
      if (change === -1) {
        freet.approvers.get(userId).forEach(async link => {
          const approveLink = await LinkCollection.findOneApproveLink(link, freetId);
          if (approveLink.count !== 1) {
            approveLink.count -= 1;
          }

          approveLink.users = approveLink.users.filter(user => user !== userId);
          await approveLink.save();
        });
        freet.approvers.delete(userId);
      } else {
        freet.approvers.set(userId, []);
      }
    } else {
      freet.disproves += change;
      if (change === -1) {
        freet.disprovers.get(userId).forEach(async link => {
          const approveLink = await LinkCollection.findOneApproveLink(link, freetId);
          if (approveLink.count !== 1) {
            approveLink.count -= 1;
          }

          approveLink.users = approveLink.users.filter(user => user !== userId);
          await approveLink.save();
        });
        freet.disprovers.delete(userId);
      } else {
        freet.disprovers.set(userId, []);
      }
    }

    await freet.save();
  }

  /**
   * Add the approve link to the freet
   *
   * @param userId id of the user
   * @param freetId id of the freet
   * @param url the url that the user is trying to add
   * @return {Promise<number | boolean>} link count if it was added successfully, otherwise false
   */
  static async addApproveLink(
    userId: Types.ObjectId | string,
    freetId: Types.ObjectId | string,
    url: string
  ): Promise<number | boolean> {
    const freet = await FreetModel.findById(freetId);
    const {approvers} = freet;
    const {approveLinks} = freet;
    if (!approvers.get(userId).includes(url) && approvers.get(userId).length < 3) {
      freet.approvers.get(userId).push(url);
      if (approveLinks.has(url)) {
        freet.approveLinks.set(url, freet.approveLinks.get(url) + 1);
      } else {
        freet.approveLinks.set(url, 1);
      }

      const linkCount = freet.approveLinks.get(url);
      await freet.save();
      return linkCount;
    }

    return false;
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
    uniqueLinks.delete(uniqueId);

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
