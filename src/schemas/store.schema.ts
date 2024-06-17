import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type StoreDocument = Store & Document;
@Schema({
  collection: 'store',
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  versionKey: false,
})
export class Store {
  @Prop()
  site_id: string;

  @Prop()
  site_desc: string;

  @Prop()
  site_address: string;

  @Prop()
  site_tel: string;

  @Prop()
  location: { type: string; coordinates: string[] };

  @Prop()
  site_close_time: string;

  @Prop()
  site_open_time: string;
}

export const StoreSchema = SchemaFactory.createForClass(Store);
