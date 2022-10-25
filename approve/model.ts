import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from 'freet/model';

export type Approve = {
  _id: Types.ObjectId;
  approverId: Types.ObjectId;
  freetId: Types.ObjectId;
};

export type PopulatedApprove = {
  _id: Types.ObjectId;
  approverId: User;
  freetId: Freet;
};

const ApproveSchema = new Schema({
  approverId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  freetId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  }
});

const ApproveModel = model<Approve>('Approve', ApproveSchema);
export default ApproveModel;
