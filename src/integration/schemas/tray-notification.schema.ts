import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TrayNotificationDocument = TrayNotification & Document;

@Schema({ timestamps: true })
export class TrayNotification {
  @Prop({ required: true })
  seller_id: number;

  @Prop({ required: true })
  scope_id: number;

  @Prop({ required: true })
  scope_name: string;

  @Prop({ required: true })
  act: string;

  @Prop({ type: Object })
  full_payload: any;

  @Prop({ default: false })
  processed: boolean;
}

export const TrayNotificationSchema = SchemaFactory.createForClass(TrayNotification);
