import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type Like = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  freetId: Types.ObjectId;
};

export type PopulatedLike = {
  _id: Types.ObjectId;
  userId: User;
  freetId: Types.ObjectId;
};

const LikeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  freetId: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

const LikeModel = model<Like>('Like', LikeSchema);
export default LikeModel;
