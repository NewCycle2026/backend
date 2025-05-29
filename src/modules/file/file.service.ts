// src/modules/file/file.service.ts
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileService {
  constructor(private readonly prisma: PrismaService) {}

  async save(file: Express.Multer.File, postId: number) {
    return this.prisma.file.create({
      data: {
        postId,
        originalName: file.originalname,
        storedName: file.filename,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path,
      },
    });
  }
}
