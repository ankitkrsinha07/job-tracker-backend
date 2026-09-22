import { body } from "express-validator";

export const createApplicationRules = [
  body("company")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ max: 100 })
    .withMessage("Company name cannot exceed 100 characters"),

  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isLength({ max: 100 })
    .withMessage("Role cannot exceed 100 characters"),

  body("status")
    .optional()
    .isIn(["applied", "interview", "rejected", "offer"])
    .withMessage("Status must be applied, interview, rejected, or offer"),

  body("jobUrl").optional().isURL().withMessage("Job URL must be a valid URL"),

  body("appliedDate")
    .optional()
    .isISO8601()
    .withMessage("Applied date must be a valid date"),
];

export const updateApplicationRules = [
  body("company")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Company name cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Company name cannot exceed 100 characters"),

  body("role")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Role cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Role cannot exceed 100 characters"),

  body("status")
    .optional()
    .isIn(["applied", "interview", "rejected", "offer"])
    .withMessage("Status must be applied, interview, rejected, or offer"),

  body("jobUrl").optional().isURL().withMessage("Job URL must be a valid URL"),
];
