// 📁 src/modules/admin-dashboard/admin-dashboard.service.ts
import { Injectable } from '@nestjs/common';


@Injectable()
export class AdminDashboardService {
  getSummaryStats() {
    return { posts: 0, comments: 0, users: 0 }; // 임시 응답
  }

  getDailyPostCounts() {
    return [
      { date: '2024-01-01', posts: 3, comments: 5 },
      { date: '2024-01-02', posts: 1, comments: 2 },
    ];
  }

  getPostList(page: number, take: number, isDeleted?: boolean, keyword?: string) {
    return { items: [], total: 0 }; // mock
  }

  getPostDetail(id: number) {
    return { id, title: 'mock title', content: 'mock content' };
  }

  deletePostByAdmin(postId: number, adminId: number, ip: string, userAgent: string) {
    return { success: true };
  }

  getCommentList(
    page: number,
    take: number,
    isDeleted?: boolean,
    keyword?: string,
  ) {
    return { items: [], total: 0 };
  }

  getCommentDetail(id: number) {
    return { id, content: 'sample comment' };
  }

  deleteCommentByAdmin(commentId: number, adminId: number, ip: string, userAgent: string) {
    return { success: true };
  }
}