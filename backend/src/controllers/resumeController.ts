import { prisma } from "../services/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { resumeCreateSchema, resumeUpdateSchema } from "../validators/resume";

export const listResumes = asyncHandler(async (_req, res) => {
  const resumes = await prisma.resume.findMany({ orderBy: { createdAt: "desc" } });
  res.json(resumes);
});

export const getActiveResume = asyncHandler(async (_req, res) => {
  const resume = await prisma.resume.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" }
  });
  res.json(resume);
});

export const createResume = asyncHandler(async (req, res) => {
  const data = resumeCreateSchema.parse(req.body);
  const resume = await prisma.$transaction(async (tx) => {
    if (data.isActive) {
      await tx.resume.updateMany({ data: { isActive: false }, where: { isActive: true } });
    }
    return tx.resume.create({ data });
  });
  res.status(201).json(resume);
});

export const updateResume = asyncHandler(async (req, res) => {
  const data = resumeUpdateSchema.parse(req.body);
  const resume = await prisma.$transaction(async (tx) => {
    if (data.isActive) {
      await tx.resume.updateMany({ data: { isActive: false }, where: { isActive: true } });
    }
    return tx.resume.update({ where: { id: req.params.id }, data });
  });
  res.json(resume);
});

export const deleteResume = asyncHandler(async (req, res) => {
  await prisma.resume.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
