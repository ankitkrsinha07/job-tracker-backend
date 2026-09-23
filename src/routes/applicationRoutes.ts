import express, { Request, Response } from "express";
import prisma from "../db.js";
import protect from "../middleware/protect.js";
import validate from "../middleware/validate.js";
import {
  createApplicationRules,
  updateApplicationRules,
} from "../validators/applicationValidator.js";

const router = express.Router();

router.get("/", protect, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const applications = await prisma.jobApplication.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(applications);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/stats", protect, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const applications = await prisma.jobApplication.findMany({
      where: { userId },
    });
    const stats = applications.reduce((counts: Record<string, number>, app) => {
      counts[app.status] = (counts[app.status] || 0) + 1;
      return counts;
    }, {});
    const total = applications.length;

    res.status(200).json({ stats, total });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/",
  protect,
  createApplicationRules,
  validate,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const { company, role, status, appliedDate, notes, jobUrl, salary } =
        req.body;

      if (!company || !role) {
        return res.status(400).json({ error: "Company and role are required" });
      }

      const application = await prisma.jobApplication.create({
        data: {
          company,
          role,
          status: status || "applied",
          appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
          notes,
          jobUrl,
          salary,
          userId,
        },
      });

      res.status(201).json(application);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
);

router.put(
  "/:id",
  protect,
  updateApplicationRules,
  validate,
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const id = parseInt(req.params.id);

      const { company, role, status, appliedDate, notes, jobUrl, salary } =
        req.body;

      // Check application exists and belongs to this user
      const existing = await prisma.jobApplication.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return res.status(404).json({ error: "Application not found" });
      }

      const updated = await prisma.jobApplication.update({
        where: { id },
        data: {
          company: company ?? existing.company,
          role: role ?? existing.role,
          status: status ?? existing.status,
          appliedDate: appliedDate
            ? new Date(appliedDate)
            : existing.appliedDate,
          notes: notes ?? existing.notes,
          jobUrl: jobUrl ?? existing.jobUrl,
          salary: salary ?? existing.salary,
        },
      });

      res.status(200).json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
);

router.delete(
  "/:id",
  protect,
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const id = parseInt(req.params.id);

      // Check it exists and belongs to this user
      const existing = await prisma.jobApplication.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return res.status(404).json({ error: "Application not found" });
      }

      await prisma.jobApplication.delete({
        where: { id },
      });

      res.status(200).json({ message: "Application deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
);

export default router;
