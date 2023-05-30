const { PrismaClient } = require("@prisma/client");
const { handleFormSubmit } = require ("../src/scenes/form")

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: handleFormSubmit(formValue)
  });

  const allUsers = await prisma.user.findMany();
  console.dir(allUsers, { depth: null });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
