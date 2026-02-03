import { Router } from "express";
import { listSkills } from "../controllers/skillController";
import { listProjects } from "../controllers/projectController";
import { listExperiences } from "../controllers/experienceController";
import { listEducation } from "../controllers/educationController";
import { getActiveResume } from "../controllers/resumeController";
import { listHobbies } from "../controllers/hobbyController";
import { getContactInfo } from "../controllers/contactInfoController";
import { createMessage } from "../controllers/messageController";
import { listApprovedTestimonials, submitTestimonial } from "../controllers/testimonialController";

export const publicRouter = Router();

publicRouter.get("/skills", listSkills);
publicRouter.get("/projects", listProjects);
publicRouter.get("/experiences", listExperiences);
publicRouter.get("/education", listEducation);
publicRouter.get("/resume", getActiveResume);
publicRouter.get("/hobbies", listHobbies);
publicRouter.get("/contact-info", getContactInfo);
publicRouter.get("/testimonials", listApprovedTestimonials);

publicRouter.post("/messages", createMessage);
publicRouter.post("/testimonials", submitTestimonial);
