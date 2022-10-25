import type {HydratedDocument} from 'mongoose';
import type {Approve, PopulatedApprove} from '../approve/model';

type ApproveResponse = {
  _id: string;
  freetId: string;
  user: string;
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
