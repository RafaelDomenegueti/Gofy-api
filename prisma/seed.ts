import { PrismaClient } from '@prisma/client';
import { users } from '../data/users';
import { tags } from '../data/tags';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany({});
  await prisma.user.createMany({
    data: users,
  });

  await prisma.tag.deleteMany({});
  await prisma.tag.createMany({
    data: tags,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async () => {
    await prisma.$disconnect();
  });
