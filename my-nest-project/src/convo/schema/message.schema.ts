import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class Conversation {
  @Prop()
  conversationId: string;

  @Prop()
  content: string;

  @Prop()
  role: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}
