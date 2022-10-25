import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from 'freet/model';

export type Disprove = {
  _id: Types.ObjectId;
  disproverId: Types.ObjectId;
  freetId: Types.ObjectId;
};

export type PopulatedDisprove = {
  _id: Types.ObjectId;
  disproverId: User;
  freetId: Freet;
};

const DisproveSchema = new Schema({
  disproverId: {
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

const DisproveModel = model<Disprove>('Disprove', DisproveSchema);
export default DisproveModel;
