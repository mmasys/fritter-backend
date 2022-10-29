import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Freet} from 'freet/model';

export type Link = {
  _id: Types.ObjectId;
  isApprove: boolean;
  url: string;
  count: number;
  users: string[];
  freetId: Types.ObjectId;
};

export type PopulatedLink = {
  _id: Types.ObjectId;
  isApprove: boolean;
  url: string;
  count: number;
  users: string[];
  freetId: Freet;
};

const LinkSchema = new Schema({
  isApprove: {
    type: Boolean,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true
  },
  users: {
    type: [String],
    required: true
  },
  freetId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  }
});

const LinkModel = model<Link>('Link', LinkSchema);
export default LinkModel;
