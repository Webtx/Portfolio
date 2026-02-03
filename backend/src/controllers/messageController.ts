import { prisma } from "../services/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { messageCreateSchema } from "../validators/message";

export const listMessages = asyncHandler(async (_req, res) => {
  const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });
  res.json(messages);
});

export const createMessage = asyncHandler(async (req, res) => {
  const data = messageCreateSchema.parse(req.body);
  const message = await prisma.message.create({ data });
  res.status(201).json(message);
});

export const deleteMessage = asyncHandler(async (req, res) => {
  await prisma.message.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
