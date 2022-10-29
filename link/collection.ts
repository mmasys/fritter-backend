import type {HydratedDocument, Types} from 'mongoose';
import type {Link} from './model';
import FreetModel from '../freet/model';
import LinkModel from './model';
import FreetCollection from '../freet/collection';

class LinkCollection {
  /**
  * Find an approve link that a user posted within the freet if it exists
  *
  * @param {string} url - The url of the link
  * @param {Types.ObjectId | string} freetId - The id of the freet
  * @param {Types.ObjectId | string} userId - The id of the user
  * @return {Promise<HydratedDocument<Link>> | Promise<null>} - The specific link, if it exists
  */
  static async findOneUserApproveLink(
    url: string,
    freetId: Types.ObjectId | string,
    userId: Types.ObjectId | string
  ): Promise<HydratedDocument<Link>> {
    return LinkModel.findOne({url, freetId, userId}).populate('url');
  }

  /**
  * Find an approve link within the freet if it exists
  *
  * @param {string} url - The url of the link
  * @param {Types.ObjectId | string} freetId - The id of the freet
  * @return {Promise<HydratedDocument<Link>> | Promise<null>} - The link, if it exists
  */
  static async findOneApproveLink(
    url: string,
    freetId: Types.ObjectId | string
  ): Promise<HydratedDocument<Link>> {
    return LinkModel.findOne({url, freetId}).populate('url');
  }

  /**
  * Add an approve link to the collection
  *
  * @param {Types.ObjectId} userId - The id of the user who submitted the link
  * @param {string} url - The url of the approve link
  * @param {Types.ObjectId | string} freetId - The id of the freet
  * @return {Promise<HydratedDocument<Link>>} - The newly created Freet, or null if unable to add link
  */
  static async addOneApproveLink(
    userId: Types.ObjectId | string,
    url: string,
    freetId: Types.ObjectId | string
  ): Promise<HydratedDocument<Link>> {
    const newLink = await FreetCollection.addApproveLink(userId, freetId, url);
    if (newLink) {
      const link = new LinkModel({
        isApprove: true,
        url,
        count: 1,
        users: [userId],
        freetId
      });
      await link.save();
      return link.populate(['users', 'freetId']);
    }
  }

  /**
  * Update an existing approve link within a freet
  *
  * @param {string} userId - The id of the user who submitted the link
  * @param {string} url - The url of the approve link
  * @param {Types.ObjectId | string} freetId - The id of the freet
  * @return {Promise<HydratedDocument<Link>>} - The newly created Freet, or null if unable to add link
  */
  static async updateOneApproveLink(
    userId: string,
    url: string,
    freetId: Types.ObjectId | string
  ): Promise<HydratedDocument<Link>> {
    const link = await this.findOneApproveLink(url, freetId);
    const linkCount = await FreetCollection.addApproveLink(userId, freetId, url);
    if (linkCount) {
      link.count = parseInt(linkCount.toString(), 10);
      if (!link.users.includes(userId)) {
        link.users.push(userId);
      }

      await link.save();
      return link;
    }
  }

  /**
   * Delete a link posted by a user with the given url and freetId.
   *
   * @param {string} userId - The userId of the user
   * @param {string} freetId - The freetId of the freet the link is on
   * @param {string} url - The link
   * @return {Promise<Boolean>} - true if the link has been deleted, false otherwise
   */
  static async deleteOne(
    userId: string,
    freetId: Types.ObjectId | string,
    url: string
  ): Promise<boolean> {
    const link = await this.findOneApproveLink(url, freetId);
    const freet = await FreetCollection.findOne(freetId);
    if (link?.count === 1) {
      const deletedLink = await LinkModel.deleteOne({freetId, url});
      return deletedLink !== null;
    }

    link.count -= 1;
    link.users = link.users.filter(user => user !== userId);
    if (freet.approvers.has(userId)) {
      const newApprovers = freet.approvers.get(userId).filter(link => link !== url);
      freet.approvers.set(userId, newApprovers);
    }

    if (freet.approveLinks.has(url)) {
      const newCount = freet.approveLinks.get(url) - 1;
      if (newCount > 0) {
        freet.approveLinks.set(url, newCount);
      } else {
        freet.approveLinks.delete(url);
      }
    }

    await freet.save();
    await link.save();
    return true;
  }

  /**
   * Delete all links posted by a user on a given freet.
   *
   * @param {string} freetId - The freetId of the freet the link is on
   * @param {string} userId - The userId of the user that posted this link
   */
  static async deleteMany(
    freetId: Types.ObjectId | string,
    userId: Types.ObjectId | string
  ): Promise<void> {
    // Might not have to use this
    await LinkModel.deleteMany({freetId, userId});
  }

  /**
   * Get all the approve links in a freet, sorted from most to least number of adds
   *
   * @param {Types.ObjectId | string} freetId - The id of the freet
   * @return {Promise<HydratedDocument<Link>[]>} - An array of a freet's most popular links
   */
  static async findMostPopularApproveLinks(
    freetId: Types.ObjectId | string
  ): Promise<Array<HydratedDocument<Link>>> {
    return LinkModel.find({freetId}).sort({count: -1}).populate('url');
  }
}

export default LinkCollection;
