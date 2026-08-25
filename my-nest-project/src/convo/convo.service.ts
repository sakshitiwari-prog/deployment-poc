import { Injectable } from '@nestjs/common';
import { CreateConvoDto } from './dto/create-convo.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Conversation } from './schema/convo.schema';
import { Model } from 'mongoose';
@Injectable()
export class ConvoService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly convoModel: Model<Conversation>,
  ) {}

  async createConversationList(createConvoDto: CreateConvoDto) {
    const conversation = await this.convoModel.create({
      name: createConvoDto.name,
    });

    return conversation;
  }

  async getConversationList() {
    try {
      const list = await this.convoModel.find();
      return {
        status: 200,
        data: list,
      };
    } catch (e) {
      throw e;
    }
  }
  getConversationItemList(id: number) {
    return `This action returns a #${id} convo`;
  }

  addChatInConversation(updateConvoDto: CreateMessageDto) {
    return `This action updates a  convo`;
  }
}
