import type {HydratedDocument} from 'mongoose';
import type {Like, PopulatedLike} from '../like/model';

type LikeResponse = {
  _id: string;
  freetId: string;
  user: string;
};

/**
 * Given a raw Freet object from the database, convert it into an
 * object with all of the information needed by the frontend
 *
 * @param {HydratedDocument<Like>} like - The raw Freet object
 * @returns {LikeResponse} - The freet object formatted for the frontend
 */
export const constructLikeResponse = (like: HydratedDocument<Like>): LikeResponse => {
  if (like.freetId) {
    const likeCopy: PopulatedLike = {
      ...like.toObject({
        versionKey: false
      })
    };
    const {username} = likeCopy.likerId;
    delete likeCopy.likerId;
    return {
      ...likeCopy,
      _id: likeCopy._id.toString(),
      freetId: likeCopy.freetId._id.toString(),
      user: username
    };
  }
};
