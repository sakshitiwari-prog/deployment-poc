import { Test, TestingModule } from '@nestjs/testing';
import { ConvoController } from './convo.controller';
import { ConvoService } from './convo.service';

describe('ConvoController', () => {
  let controller: ConvoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConvoController],
      providers: [ConvoService],
    }).compile();

    controller = module.get<ConvoController>(ConvoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
