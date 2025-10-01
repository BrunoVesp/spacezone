import prisma from "../db/prisma";
import { Post, User } from "../generated/prisma";

const RedatorService = {
  async createRedator(id: number): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { isRedator: true },
    });
  },

  async getAllRedatores(): Promise<User[]> {
    return prisma.user.findMany({
      include: {
        Post: true,
        Comentary: true
      },
      where: { isRedator: true }
    });
  },

  async demoteRedator(id: number): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { isRedator: false }
    });
  },
};

export default RedatorService;
