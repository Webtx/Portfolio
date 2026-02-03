import { Router } from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth";
import { listSkills, createSkill, updateSkill, deleteSkill } from "../controllers/skillController";
import { listProjects, createProject, updateProject, deleteProject } from "../controllers/projectController";
import { listExperiences, createExperience, updateExperience, deleteExperience } from "../controllers/experienceController";
import { listEducation, createEducation, updateEducation, deleteEducation } from "../controllers/educationController";
import { listResumes, createResume, updateResume, deleteResume } from "../controllers/resumeController";
import { listContactInfo, createContactInfo, updateContactInfo, deleteContactInfo } from "../controllers/contactInfoController";
import { listHobbies, createHobby, updateHobby, deleteHobby } from "../controllers/hobbyController";
import { listMessages, deleteMessage } from "../controllers/messageController";
import { listAllTestimonials, approveTestimonial, rejectTestimonial, deleteTestimonial } from "../controllers/testimonialController";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireAdmin);

adminRouter.get("/skills", listSkills);
adminRouter.post("/skills", createSkill);
adminRouter.put("/skills/:id", updateSkill);
adminRouter.delete("/skills/:id", deleteSkill);

adminRouter.get("/projects", listProjects);
adminRouter.post("/projects", createProject);
adminRouter.put("/projects/:id", updateProject);
adminRouter.delete("/projects/:id", deleteProject);

adminRouter.get("/experiences", listExperiences);
adminRouter.post("/experiences", createExperience);
adminRouter.put("/experiences/:id", updateExperience);
adminRouter.delete("/experiences/:id", deleteExperience);

adminRouter.get("/education", listEducation);
adminRouter.post("/education", createEducation);
adminRouter.put("/education/:id", updateEducation);
adminRouter.delete("/education/:id", deleteEducation);

adminRouter.get("/resumes", listResumes);
adminRouter.post("/resumes", createResume);
adminRouter.put("/resumes/:id", updateResume);
adminRouter.delete("/resumes/:id", deleteResume);

adminRouter.get("/contact-info", listContactInfo);
adminRouter.post("/contact-info", createContactInfo);
adminRouter.put("/contact-info/:id", updateContactInfo);
adminRouter.delete("/contact-info/:id", deleteContactInfo);

adminRouter.get("/hobbies", listHobbies);
adminRouter.post("/hobbies", createHobby);
adminRouter.put("/hobbies/:id", updateHobby);
adminRouter.delete("/hobbies/:id", deleteHobby);

adminRouter.get("/messages", listMessages);
adminRouter.delete("/messages/:id", deleteMessage);

adminRouter.get("/testimonials", listAllTestimonials);
adminRouter.post("/testimonials/:id/approve", approveTestimonial);
adminRouter.post("/testimonials/:id/reject", rejectTestimonial);
adminRouter.delete("/testimonials/:id", deleteTestimonial);
