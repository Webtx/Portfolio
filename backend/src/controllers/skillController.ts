import { prisma } from "../services/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { skillCreateSchema, skillUpdateSchema } from "../validators/skill";

export const listSkills = asyncHandler(async (_req, res) => {
  const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
  res.json(skills);
});

export const createSkill = asyncHandler(async (req, res) => {
  const data = skillCreateSchema.parse(req.body);
  const skill = await prisma.skill.create({ data });
  res.status(201).json(skill);
});

export const updateSkill = asyncHandler(async (req, res) => {
  const data = skillUpdateSchema.parse(req.body);
  const skill = await prisma.skill.update({ where: { id: req.params.id }, data });
  res.json(skill);
});

export const deleteSkill = asyncHandler(async (req, res) => {
  await prisma.skill.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
