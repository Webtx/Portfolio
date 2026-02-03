import { prisma } from "../services/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { contactInfoCreateSchema, contactInfoUpdateSchema } from "../validators/contactInfo";

export const listContactInfo = asyncHandler(async (_req, res) => {
  const info = await prisma.contactInfo.findMany({ orderBy: { updatedAt: "desc" } });
  res.json(info);
});

export const getContactInfo = asyncHandler(async (_req, res) => {
  const info = await prisma.contactInfo.findFirst({ orderBy: { updatedAt: "desc" } });
  res.json(info);
});

export const createContactInfo = asyncHandler(async (req, res) => {
  const data = contactInfoCreateSchema.parse(req.body);
  const info = await prisma.contactInfo.create({ data });
  res.status(201).json(info);
});

export const updateContactInfo = asyncHandler(async (req, res) => {
  const data = contactInfoUpdateSchema.parse(req.body);
  const info = await prisma.contactInfo.update({ where: { id: req.params.id }, data });
  res.json(info);
});

export const deleteContactInfo = asyncHandler(async (req, res) => {
  await prisma.contactInfo.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
