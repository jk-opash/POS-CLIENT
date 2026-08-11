import { PrismaClient } from '/Users/cms/Desktop/NODE/POS-BACKEND/node_modules/@prisma/client/index.js';
const prisma = new PrismaClient();
async function main() {
  const order = await prisma.order.findFirst({
    where: { status: 'Pending', running_order: { not: null } }
  });
  console.log("running_order", JSON.stringify(order?.running_order, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
