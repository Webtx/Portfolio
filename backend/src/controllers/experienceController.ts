import { prisma } from "../services/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { experienceCreateSchema, experienceUpdateSchema } from "../validators/experience";

export const listExperiences = asyncHandler(async (_req, res) => {
  const experiences = await prisma.experience.findMany({ orderBy: { order: "asc" } });
  res.json(experiences);
});

export const createExperience = asyncHandler(async (req, res) => {
  const data = experienceCreateSchema.parse(req.body);
  const experience = await prisma.experience.create({
    data: {
      ...data,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null
    }
  });
  res.status(201).json(experience);
});

export const updateExperience = asyncHandler(async (req, res) => {
  const data = experienceUpdateSchema.parse(req.body);
  const experience = await prisma.experience.update({
    where: { id: req.params.id },
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined
    }
  });
  res.json(experience);
});

export const deleteExperience = asyncHandler(async (req, res) => {
  await prisma.experience.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
