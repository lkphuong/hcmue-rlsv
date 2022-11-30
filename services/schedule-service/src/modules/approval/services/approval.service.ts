import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ApprovalEntity } from '../../../entities/approval.entity';

@Injectable()
export class ApprovalService {}
