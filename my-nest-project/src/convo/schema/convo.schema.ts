import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Conversation {
  @Prop()
  name: string;

  @Prop()
  lastInteractionId?: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}
export const ConversationSchema = SchemaFactory.createForClass(Conversation);
