import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ConvoService } from './convo.service';
import { CreateConvoDto } from './dto/create-convo.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('convo')
export class ConvoController {
  constructor(private readonly convoService: ConvoService) {}

  @Post('add')
  createConversationList(@Body() createConvoDto: CreateConvoDto) {
    return this.convoService.createConversationList(createConvoDto);
  }

  @Get('')
  getConversationList() {
    return this.convoService.getConversationList();
  }

  @Get(':id')
  getConversationItemList(@Param('id') id: string) {
    return this.convoService.getConversationItemList(+id);
  }

  @Post('add/msg')
  addChatInConversation(@Body() createConvoDto: CreateMessageDto) {
    return this.convoService.addChatInConversation(createConvoDto);
  }
}
