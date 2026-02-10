import { prisma } from "../services/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { hobbyCreateSchema, hobbyUpdateSchema } from "../validators/hobby";

export const listHobbies = asyncHandler(async (_req, res) => {
  const hobbies = await prisma.hobby.findMany({ orderBy: { order: "asc" } });
  res.json(hobbies);
});

export const createHobby = asyncHandler(async (req, res) => {
  const data = hobbyCreateSchema.parse(req.body);
  const hobby = await prisma.hobby.create({
    data: {
      ...data,
      name: data.name ?? { en: "", fr: "" }
    }
  });
  res.status(201).json(hobby);
});

export const updateHobby = asyncHandler(async (req, res) => {
  const data = hobbyUpdateSchema.parse(req.body);
  const hobby = await prisma.hobby.update({ where: { id: req.params.id }, data });
  res.json(hobby);
});

export const deleteHobby = asyncHandler(async (req, res) => {
  await prisma.hobby.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
