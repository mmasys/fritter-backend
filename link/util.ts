import type {HydratedDocument} from 'mongoose';
import type {Freet} from '../freet/model';
import type {Link, PopulatedLink} from './model';

type LinkResponse = {
  _id: string;
  isApprove: boolean;
  url: string;
  count: number;
  users: string[];
  freetId: Freet;
};

/**
 * Transform a raw Link object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Link>} link - A link
 * @returns {LinkResponse} - The link object formatted for the frontend
 */
const constructLinkResponse = (link: HydratedDocument<Link>): LinkResponse => {
  const linkCopy: PopulatedLink = {
    ...link.toObject({
      versionKey: false
    })
  };
  return {
    _id: linkCopy._id.toString(),
    isApprove: linkCopy.isApprove,
    url: linkCopy.url,
    count: linkCopy.count,
    users: linkCopy.users,
    freetId: linkCopy.freetId
  };
};

export {
  constructLinkResponse
};
