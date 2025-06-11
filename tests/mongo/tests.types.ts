import { ObjectId } from 'mongodb';

export interface TestsDoc {
    _id: ObjectId;
    name: string;
    count: number;
    timestamp: Date;
}
