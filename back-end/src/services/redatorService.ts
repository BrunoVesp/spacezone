import prisma from "../db/prisma";
import { Redator, Post } from "../generated/prisma";

interface CreateRedatorDTO {
  userId: number;
  isAdm: boolean;
}

interface DeleteRedator {
  id: number;
}

const RedatorService = {
  async createRedator(data: CreateRedatorDTO): Promise<Redator> {
    return prisma.redator.create({
      data
    });
  },

  async getAllRedatores(): Promise<Redator[]> {
    return prisma.redator.findMany({
      include: {
        user: true,
        posts: true
      },
      where: { isAdm: true }
    });
  },

  async getRedatorById(id: number): Promise<Redator | null> {
    return prisma.redator.findUnique({
      where: { id },
      include: { user: true, posts: true }
    });
  },

  async deleteRedator(id: number): Promise<Redator> {
    return prisma.redator.update({
      where: { id },
      data: { isAdm: false }
    });
  },

  // Funções de Posts
  async createPost(authorId: number, postData: { title: string; subtitle: string; body: string }): Promise<Post> {
    return prisma.post.create({
      data: {
        ...postData,
        authorId
      }
    });
  },

  async updatePost(postId: number, postData: { title?: string; subtitle?: string; body?: string }): Promise<Post> {
    return prisma.post.update({
      where: { id: postId },
      data: postData
    });
  },

  async deletePost(postId: number): Promise<Post> {
    return prisma.post.delete({
      where: { id: postId }
    });
  }
};

export default RedatorService;
