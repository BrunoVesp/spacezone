import { User } from "@prisma/client";
import prisma from "../db/prisma";

const RedatorService = {
  async createRedator(id: number): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { isRedator: true },
    });
  },

  async getAllRedatores(skip: number, take: number): Promise<{ total: number; redatores: User[] }> {
    const total = await prisma.user.count({ where: { isRedator: true } });
    
    const redatores = await prisma.user.findMany({
      where: { isRedator: true },
      skip,
      take
    });
    
    return { total, redatores };
},

  async demoteRedator(id: number): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { isRedator: false }
    });
  },
};

export default RedatorService;
