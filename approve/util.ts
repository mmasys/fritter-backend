import type {HydratedDocument} from 'mongoose';
import type {Approve, PopulatedApprove} from '../approve/model';

type ApproveResponse = {
  _id: string;
  freetId: string;
  user: string;
};

type LinkResponse = {
  link: string | number;
  count: string | number;
};

/**
 * Given a raw Freet object from the database, convert it into an
 * object with all of the information needed by the frontend
 *
 * @param {HydratedDocument<Approve>} approve - The raw Freet object
 * @returns {ApproveResponse} - The freet object formatted for the frontend
 */
export const constructApproveResponse = (approve: HydratedDocument<Approve>): ApproveResponse => {
  if (approve.freetId) {
    const approveCopy: PopulatedApprove = {
      ...approve.toObject({
        versionKey: false
      })
    };
    const {username} = approveCopy.approverId;
    delete approveCopy.approverId;
    return {
      ...approveCopy,
      _id: approveCopy._id.toString(),
      freetId: approveCopy.freetId._id.toString(),
      user: username
    };
  }
};

/**
 * Given a map of approve links mapped to their number of occurrences, return an array
 * with all the approve links on a freet, sorted from most to least number of occurences
 *
 * @param {Map<string, number>} approveLinks - The approve links count map
 * @returns {Array<string>} - List of all the approve links sorted from most to least popular
 */
export const sortApproveLinks = (
  approveLinks: Map<string, number>
): string[] => {
  const linkItems = Object.keys(approveLinks).map(link => [link, approveLinks.get(link)]);
  const sortedLinkItems = linkItems.sort((a, b) => parseInt(a[1].toString(), 10) - parseInt(b[1].toString(), 10));
  return sortedLinkItems.map(e => e[0].toString());
};

/**
 * Given a map of approve links mapped to their number of occurrences, returns an object
 * with all of the information needed by the frontend
 *
 * @param {string} approveLink - Specific approve link
 * @param {Map<string, number>} approveLinks - The approve links count map
 * @returns {LinkResponse} -
 */
export const constructLinkResponse = (
  approveLink: string,
  approveLinks: Map<string, number>
): LinkResponse => {
  if (approveLink) {
    const count = approveLinks.get(approveLink);
    return {
      link: approveLink,
      count
    };
  }
};
