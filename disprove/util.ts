import type {HydratedDocument} from 'mongoose';
import type {Disprove, PopulatedDisprove} from '../disprove/model';

type DisproveResponse = {
  _id: string;
  freetId: string;
  user: string;
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
