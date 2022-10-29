import type {HydratedDocument, Types} from 'mongoose';
import type {Approve} from './model';
import FreetModel from '../freet/model';
import ApproveModel from './model';
import FreetCollection from '../freet/collection';
import * as util from './util';

class ApproveCollection {
  /**
  * Add an Approve to the collection
  *
  * @param {string} approverId - The id of the freet approver
  * @param {string} freetId - The id of the freet
  * @return {Promise<HydratedDocument<Freet>>} - The newly created Freet
  */
  static async addOne(
    approverId: Types.ObjectId,
    freetId: Types.ObjectId | string
  ): Promise<HydratedDocument<Approve>> {
    const approve = new ApproveModel({
      approverId,
      freetId
    });
    await FreetCollection.updateApproveOrDisprove(approverId, freetId, 1, true);
    await approve.save();
    return approve.populate(['approverId', 'freetId']);
  }

  /**
   * Get an Approve by freetId and userId
   *
   * @param {string} approverId - The id of the freet approver
   * @param {string} freetId - The id of the freet
   * @return {Promise<boolesn>} - true if the user has approved the freet, false otherwise
   */
  static async findApprove(
    approverId: Types.ObjectId,
    freetId: Types.ObjectId | string
  ): Promise<boolean> {
    const freet = await FreetModel.findOne({_id: freetId});
    if (freet.approvers.has(approverId) || freet.disprovers.has(approverId)) {
      return true;
    }

    return false;
  }

  /**
  * Remove an Approve from the collection
  *
  * @param {string} approverId - The id of the freet approver
  * @param {string} freetId - The id of the freet
  * @return {Promise<boolean>} - true if the approcve has been deleted, false otherwise
  */
  static async deleteOne(
    approverId: Types.ObjectId,
    freetId: Types.ObjectId | string
  ): Promise<boolean> {
    const deletedApprove = await ApproveModel.deleteOne({
      approverId,
      freetId
    });
    if (deletedApprove) {
      await FreetCollection.updateApproveOrDisprove(approverId, freetId, -1, true);
    }

    return deletedApprove !== null;
  }

  /**
   * Get an Approve link by freetId and userId
   *
   * @param {string} approverId - The id of the freet approver
   * @param {string} freetId - The id of the freet
   * @param {string} link - The link url
   * @return {Promise<boolean>} - true if the user has added that approve link to the freet,
   *                              false otherwise
   */
  static async findApproveLink(
    approverId: Types.ObjectId,
    freetId: Types.ObjectId | string,
    link: string
  ): Promise<boolean> {
    const freet = await FreetModel.findOne({_id: freetId});
    const uniqueId = link + approverId.toString();
    if (freet.disprovers.has(approverId) || freet.uniqueUserApproveLinks.has(uniqueId) || freet.approvers.get(approverId).length >= 3) {
      return true;
    }

    return false;
  }

  /**
  * Remove an Approve link from the collection
  *
  * @param {string} approverId - The id of the freet approver
  * @param {string} freetId - The id of the freet
  * @param {string} link - The link to be removed from the freet
  * @return {Promise<void | boolean>} - true if the approcve link has been deleted, false otherwise
  */
  static async deleteApproveLink(
    approverId: Types.ObjectId,
    freetId: Types.ObjectId | string,
    link: string
  ): Promise<void | boolean> {
    const approve = new ApproveModel({
      approverId,
      freetId
    });
    await FreetCollection.removeLink(approverId, freetId, link, true);
    await approve.save();
    return approve.populate(['approverId', 'freetId']);
  }

  /**
   * Check if a user can approve a freet by freetId and approverId
   *
   * @param {string} approverId - The id of the freet approver
   * @param {string} freetId - The id of the freet
   * @return {Promise<boolesn>} - true if the user has approved the freet, false otherwise
   */
  static async isApprover(
    approverId: Types.ObjectId,
    freetId: Types.ObjectId | string
  ): Promise<boolean> {
    const freet = await FreetModel.findOne({_id: freetId});
    if (freet.approvers.has(approverId)) {
      return true;
    }

    return false;
  }

  /**
   * Get all the approve links on a freet, sorted from most to least number of occurences
   *
   * @param {string} freetId - The id of the freet
   * @return {Promsie<boolean>} - true if link array was produced successfully, else false
   */
  static async findMostPopularLinks(
    freetId: string
  ): Promise<string[]> {
    const freet = FreetCollection.findOne(freetId);
    const {approveLinks} = await freet;
    return util.sortApproveLinks(approveLinks);
  }
}

export default ApproveCollection;
