import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}
}
