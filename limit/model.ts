import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type Limit = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  canPost: boolean;
};

export type PopulatedLimit = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  canPost: boolean;
};

const LimitSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  canPost: {
    type: Schema.Types.Boolean,
    required: true
  }
});

const LimitModel = model<Limit>('Limit', LimitSchema);
export default LimitModel;
