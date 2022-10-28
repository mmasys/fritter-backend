import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

export type FritterLimit = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  timeLeft: Timer;
  canPost: boolean;
};

export type PopulatedFritterLimit = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  timeLeft: Timer;
  canPost: boolean;
};

const FritterLimitSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  timeLeft: {
    type: Schema.Types.Timer,
    required: true,
    ref: '???'
  },
  canPost: {
    type: Schema.Types.Boolean,
    required: true,
    ref: '???'
  }
});

const FritterLimitModel = model<FritterLimit>('FritterLimit', FritterLimitSchema);
export default FritterLimitModel;
