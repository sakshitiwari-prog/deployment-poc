import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import 'dotenv/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConvoModule } from './convo/convo.module';
@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI!), ConvoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
