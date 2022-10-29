import type {HydratedDocument, Types} from 'mongoose';
import type {Disprove} from './model';
import FreetModel from '../freet/model';
import DisproveModel from './model';
import FreetCollection from '../freet/collection';
import * as util from './util';

class DisproveCollection {
  /**
  * Add a Disprove to the collection
  *
  * @param {string} disproverId - The id of the freet disprover
  * @param {string} freetId - The id of the freet
  * @return {Promise<HydratedDocument<Freet>>} - The newly created Freet
  */
  static async addOne(
    disproverId: Types.ObjectId,
    freetId: Types.ObjectId | string
  ): Promise<HydratedDocument<Disprove>> {
    const disprove = new DisproveModel({
      disproverId,
      freetId
    });
    await FreetCollection.updateApproveOrDisprove(disproverId, freetId, 1, false);
    await disprove.save();
    return disprove.populate(['disproverId', 'freetId']);
  }

  /**
   * Get a Disprove by freetId and userId
   *
   * @param {string} disproverId - The id of the freet disprover
   * @param {string} freetId - The id of the freet
   * @return {Promise<boolesn>} - true if the user has disproved the freet, false otherwise
   */
  static async findDisprove(
    disproverId: Types.ObjectId | string,
    freetId: Types.ObjectId | string
  ): Promise<boolean> {
    const disprove = await DisproveModel.findOne({disproverId, freetId});
    const freet = await FreetModel.findOne({_id: freetId});
    if (freet && disprove) {
      return true;
    }

    return false;
  }

  /**
  * Remove a Disprove from the collection
  *
  * @param {string} disproverId - The id of the freet disprover
  * @param {string} freetId - The id of the freet
  * @return {Promise<boolean>} - true if the disprove has been deleted, false otherwise
  */
  static async deleteOne(
    disproverId: Types.ObjectId,
    freetId: Types.ObjectId | string
  ): Promise<boolean> {
    const deletedDisprove = await DisproveModel.deleteOne({
      disproverId,
      freetId
    });
    if (deletedDisprove) {
      await FreetCollection.updateApproveOrDisprove(disproverId, freetId, -1, false);
    }

    return deletedDisprove !== null;
  }

  /**
  * Add a Disprove Link to the collection
  *
  * @param {string} disproverId - The id of the user whos adding the link
  * @param {string} freetId - The id of the freet
  * @param {string} link - The link url
  * @return {Promise<HydratedDocument<Freet>>} - The newly created Freet
  */
  static async addDisproveLink(
    disproverId: Types.ObjectId,
    freetId: Types.ObjectId | string,
    link: string
  ): Promise<HydratedDocument<Disprove>> {
    const disprove = new DisproveModel({
      disproverId,
      freetId
    });
    await FreetCollection.addLink(disproverId, freetId, link, false);
    await disprove.save();
    return disprove.populate(['disproverId', 'freetId']);
  }

  /**
  * Get a Disprove link by freetId and userId
  *
  * @param {string} disproverId - The id of the freet disprover
  * @param {string} freetId - The id of the freet
  * @param {string} link - The link url
  * @return {Promise<boolean>} - true if the user has added that approve link to the freet,
  *                              false otherwise
  */
  static async findDisproveLink(
    disproverId: Types.ObjectId,
    freetId: Types.ObjectId | string,
    link: string
  ): Promise<boolean> {
    const freet = await FreetModel.findOne({_id: freetId});
    const uniqueId = link + disproverId.toString();
    if (freet.approvers.has(disproverId) || freet.uniqueUserDisproveLinks.has(uniqueId) || freet.disprovers.get(disproverId).length >= 3) {
      return true;
    }

    return false;
  }

  /**
  * Remove a Disprove link from the collection
  *
  * @param {string} disproverId - The id of the freet disprover
  * @param {string} freetId - The id of the freet
  * @param {string} link - The link to be removed from the freet
  * @return {Promise<void | boolean>} - true if the disprove link has been deleted, false otherwise
  */
  static async deleteDisproveLink(
    disproverId: Types.ObjectId,
    freetId: Types.ObjectId | string,
    link: string
  ): Promise<void | boolean> {
    const disprove = new DisproveModel({
      disproverId,
      freetId
    });
    await FreetCollection.removeLink(disproverId, freetId, link, false);
    await disprove.save();
    return disprove.populate(['disproverId', 'freetId']);
  }

  /**
   * Check if a user has disproved a freet by freetId and disproverId
   *
   * @param {string} disproverId - The id of the freet approver
   * @param {string} freetId - The id of the freet
   * @return {Promise<boolesn>} - true if the user has approved the freet, false otherwise
   */
  static async isDisprover(
    disproverId: Types.ObjectId,
    freetId: Types.ObjectId | string
  ): Promise<boolean> {
    const freet = await FreetModel.findOne({_id: freetId});
    if (freet.disprovers.has(disproverId) && !freet.approvers.has(disproverId)) {
      return true;
    }

    return false;
  }

  /**
   * Get all the disprove links on a freet, sorted from most to least number of occurences
   *
   * @param {string} freetId - The id of the freet
   * @return {Promsie<boolean>} - true if link array was produced successfully, else false
   */
  static async findMostPopularLinks(
    freetId: string
  ): Promise<string[]> {
    const freet = FreetCollection.findOne(freetId);
    const {disproveLinks} = await freet;
    return util.sortDisproveLinks(disproveLinks);
  }
}

export default DisproveCollection;
