import { Module } from '@nestjs/common';
import { ConvoService } from './convo.service';
import { ConvoController } from './convo.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversation, ConversationSchema } from './schema/convo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Conversation.name,
        schema: ConversationSchema,
      },
    ]),
  ],
  controllers: [ConvoController],
  providers: [ConvoService],
})
export class ConvoModule {}
