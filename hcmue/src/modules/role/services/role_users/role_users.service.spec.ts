import { Test, TestingModule } from '@nestjs/testing';
import { RoleUsersService } from './role_users.service';

describe('RoleUsersService', () => {
  let service: RoleUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleUsersService],
    }).compile();

    service = module.get<RoleUsersService>(RoleUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
