import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export interface RequestValidators {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}

/**
 * Express middleware to validate incoming request body, params, and query using Zod.
 */
export const validate = (validators: RequestValidators) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errorDetails: Array<{ target: string; path: string; message: string }> = [];

    if (validators.params) {
      const result = validators.params.safeParse(req.params);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          errorDetails.push({
            target: "params",
            path: issue.path.join(".") || "params",
            message: issue.message,
          });
        });
      } else {
        Object.defineProperty(req, "params", {
          value: result.data,
          writable: true,
          configurable: true,
          enumerable: true,
        });
      }
    }

    if (validators.query) {
      const result = validators.query.safeParse(req.query);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          errorDetails.push({
            target: "query",
            path: issue.path.join(".") || "query",
            message: issue.message,
          });
        });
      } else {
        Object.defineProperty(req, "query", {
          value: result.data,
          writable: true,
          configurable: true,
          enumerable: true,
        });
      }
    }

    if (validators.body) {
      const result = validators.body.safeParse(req.body);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          errorDetails.push({
            target: "body",
            path: issue.path.join(".") || "body",
            message: issue.message,
          });
        });
      } else {
        req.body = result.data;
      }
    }

    if (errorDetails.length > 0) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errorDetails,
      });
      return;
    }

    next();
  };
};
