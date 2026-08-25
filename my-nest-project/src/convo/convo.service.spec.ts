import { Test, TestingModule } from '@nestjs/testing';
import { ConvoService } from './convo.service';

describe('ConvoService', () => {
  let service: ConvoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConvoService],
    }).compile();

    service = module.get<ConvoService>(ConvoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
