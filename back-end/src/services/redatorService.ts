import prisma from "../db/prisma";
import { Redator, Post } from "../generated/prisma";


const RedatorService = {
  async createRedator(id: number): Promise<Redator> {
    return prisma.redator.create({
      data: { userId: id, isAdm: true },
      include: { user: true, posts: true }
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
    return prisma.redator.delete({
      where: { userId: id }
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
