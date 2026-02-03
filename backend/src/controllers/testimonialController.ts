import { prisma } from "../services/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { testimonialCreateSchema } from "../validators/testimonial";

export const listApprovedTestimonials = asyncHandler(async (_req, res) => {
  const testimonials = await prisma.testimonial.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" }
  });
  res.json(testimonials);
});

export const listAllTestimonials = asyncHandler(async (_req, res) => {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" }
  });
  res.json(testimonials);
});

export const submitTestimonial = asyncHandler(async (req, res) => {
  const data = testimonialCreateSchema.parse(req.body);
  const testimonial = await prisma.testimonial.create({ data });
  res.status(201).json(testimonial);
});

export const approveTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await prisma.testimonial.update({
    where: { id: req.params.id },
    data: { status: "APPROVED" }
  });
  res.json(testimonial);
});

export const rejectTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await prisma.testimonial.update({
    where: { id: req.params.id },
    data: { status: "REJECTED" }
  });
  res.json(testimonial);
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  await prisma.testimonial.delete({ where: { id: req.params.id } });
  res.status(204).send();
});
