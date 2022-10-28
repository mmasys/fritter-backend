import type {HydratedDocument} from 'mongoose';
import type {Disprove, PopulatedDisprove} from '../disprove/model';

type DisproveResponse = {
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
 * @param {HydratedDocument<Disprove>} disprove - The raw Freet object
 * @returns {DisproveResponse} - The freet object formatted for the frontend
 */
export const constructDisproveResponse = (disprove: HydratedDocument<Disprove>): DisproveResponse => {
  if (disprove.freetId) {
    const disproveCopy: PopulatedDisprove = {
      ...disprove.toObject({
        versionKey: false
      })
    };
    const {username} = disproveCopy.disproverId;
    delete disproveCopy.disproverId;
    return {
      ...disproveCopy,
      _id: disproveCopy._id.toString(),
      freetId: disproveCopy.freetId._id.toString(),
      user: username
    };
  }
};

/**
 * Given a map of disprove links mapped to their number of occurrences, return an array
 * with all the disprove links on a freet, sorted from most to least number of occurences
 *
 * @param {Map<string, number>} disproveLinks - The disprove links count map
 * @returns {Array<string>} - List of all the disprove links sorted from most to least popular
 */
export const sortDisproveLinks = (
  disproveLinks: Map<string, number>
): string[] => {
  const linkItems = Object.keys(disproveLinks).map(link => [link, disproveLinks.get(link)]);
  const sortedLinkItems = linkItems.sort((a, b) => parseInt(a[1].toString(), 10) - parseInt(b[1].toString(), 10));
  return sortedLinkItems.map(e => e[0].toString());
};

/**
 * Given a map of disprove links mapped to their number of occurrences, returns an object
 * with all of the information needed by the frontend
 *
 * @param {string} disproveLink - Specific disprove link
 * @param {Map<string, number>} disproveLinks - The disprove links count map
 * @returns {LinkResponse} -
 */
export const constructLinkResponse = (
  disproveLink: string,
  disproveLinks: Map<string, number>
): LinkResponse => {
  if (disproveLink) {
    const count = disproveLinks.get(disproveLink);
    return {
      link: disproveLink,
      count
    };
  }
};
