import type {Freet} from '../freet/model';
import type {HydratedDocument} from 'mongoose';
import type {Follow, PopulatedFollow} from '../Follow/model';
import FreetCollection from '../freet/collection';

type FollowResponse = {
  _id: string;
  follower: string;
  followee: string;
};

/**
 * Transform a raw Follow object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Follow>} Follow - A Follow object
 * @returns {FollowResponse} - The Follow object formatted for the frontend
 */
const constructFollowResponse = (Follow: HydratedDocument<Follow>): FollowResponse => {
  const FollowCopy: PopulatedFollow = {
    ...Follow.toObject({
      versionKey: false
    })
  };
  return {
    _id: FollowCopy._id.toString(),
    follower: FollowCopy.followerId.username,
    followee: FollowCopy.followeeId.username
  };
};

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Follow>} Follow - A Follow object
 * @returns {Promise<Array<HydratedDocument<FreetResponse>>>} - The Freet object formatted for the frontend
 */
const getUserFreets = async (Follow: HydratedDocument<Follow>): Promise<Array<HydratedDocument<Freet>>> => {
  const FollowCopy: PopulatedFollow = {
    ...Follow.toObject({
      versionKey: false
    })
  };

  const freets = await FreetCollection.findAllByUsername(FollowCopy.followeeId.username);
  return freets;
};

export {
  constructFollowResponse,
  getUserFreets
};
