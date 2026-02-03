import { prisma } from "../services/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { educationCreateSchema, educationUpdateSchema } from "../validators/education";

export const listEducation = asyncHandler(async (_req, res) => {
  const education = await prisma.education.findMany({ orderBy: { order: "asc" } });
  res.json(education);
});

export const createEducation = asyncHandler(async (req, res) => {
  const data = educationCreateSchema.parse(req.body);
  const education = await prisma.education.create({
    data: {
      ...data,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null
    }
  });
  res.status(201).json(education);
});

export const updateEducation = asyncHandler(async (req, res) => {
  const data = educationUpdateSchema.parse(req.body);
  const education = await prisma.education.update({
    where: { id: req.params.id },
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined
    }
  });
  res.json(education);
});

export const deleteEducation = asyncHandler(async (req, res) => {
  await prisma.education.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
