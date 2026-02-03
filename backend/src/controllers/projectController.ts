import { prisma } from "../services/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { projectCreateSchema, projectUpdateSchema } from "../validators/project";

export const listProjects = asyncHandler(async (_req, res) => {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
  res.json(projects);
});

export const createProject = asyncHandler(async (req, res) => {
  const data = projectCreateSchema.parse(req.body);
  const project = await prisma.project.create({ data });
  res.status(201).json(project);
});

export const updateProject = asyncHandler(async (req, res) => {
  const data = projectUpdateSchema.parse(req.body);
  const project = await prisma.project.update({ where: { id: req.params.id }, data });
  res.json(project);
});

export const deleteProject = asyncHandler(async (req, res) => {
  await prisma.project.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
