import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./services/prisma";

const port = Number(env.PORT);

app.listen(port, () => {
  console.log(`API listening on :${port}`);
});

const shutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
