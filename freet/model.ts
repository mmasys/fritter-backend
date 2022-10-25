import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Freet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  dateCreated: Date;
  content: string;
  dateModified: Date;
  likes: number;
  approves: number;
  disproves: number;
  approveLinks: Map<string, number>;
  disproveLinks: Map<string, number>;
  approvers: Map<Types.ObjectId | string, string[]>;
  disprovers: Map<Types.ObjectId | string, string[]>;
  uniqueUserApproveLinks: Map<string, string>;
  uniqueUserDisproveLinks: Map<string, string>;
};

export type PopulatedFreet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  dateCreated: Date;
  content: string;
  dateModified: Date;
  likes: number;
  approves: number;
  disproves: number;
  approveLinks: Map<string, number>;
  disproveLinks: Map<string, number>;
  approvers: Map<Types.ObjectId | string, string[]>;
  disprovers: Map<Types.ObjectId | string, string[]>;
  uniqueUserApproveLinks: Map<string, string>;
  uniqueUserDisproveLinks: Map<string, string>;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FreetSchema = new Schema<Freet>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The date the freet was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The content of the freet
  content: {
    type: String,
    required: true
  },
  // The date the freet was modified
  dateModified: {
    type: Date,
    required: true
  },
  // The number of likes on the freet
  likes: {
    type: Number,
    required: true
  },
  // The number of approves on the freet
  approves: {
    type: Number,
    required: true
  },
  // The number of disproves on the freet
  disproves: {
    type: Number,
    required: true
  },
  // The approval links provided by users on a freet
  // mapped to their number of occurrences
  approveLinks: {
    type: Map,
    of: Number,
    required: true
  },
  // The disproval links provided by users on a freet
  // mapped to their number of occurences
  disproveLinks: {
    type: Map,
    of: Number,
    required: true
  },
  // A map of users to a list of the unique approve links they have added to a freet
  approvers: {
    type: Map,
    of: [String],
    required: true
  },
  // A map of users to a list of the unique disprove links they have added to a freet
  disprovers: {
    type: Map,
    of: [String],
    required: true
  },
  // A map of approve uniqueIds (link + userId) to corresponding links
  uniqueUserApproveLinks: {
    type: Map,
    of: [String],
    required: true
  },
  // A list of disprove uniqueIds (link + userId) to corresponding links
  uniqueUserDisproveLinks: {
    type: Map,
    of: [String],
    required: true
  }
});

const FreetModel = model<Freet>('Freet', FreetSchema);
export default FreetModel;
