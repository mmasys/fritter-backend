import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type Follow = {
  _id: Types.ObjectId;
  followerId: Types.ObjectId;
  followeeId: Types.ObjectId;
};

export type PopulatedFollow = {
  _id: Types.ObjectId;
  followerId: User;
  followeeId: User;
};

const FollowSchema = new Schema({
  followerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  followeeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
