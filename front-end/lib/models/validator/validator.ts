import { z } from "zod";
import RegisterSchema from "./schemas/register";
import LoginSchema from "./schemas/login";
import ActivateSchema from "./schemas/activate";
import ValidationError from "@/lib/errors/validation-error";
import SessionIdSchema from "./schemas/fields/session_id";
import ResendActivationSchema from "./schemas/resend-activation";
import ForgotPasswordSchema from "./schemas/forgot-password";
import ResetPasswordSchema from "./schemas/reset-password";

const validate = <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
): z.infer<T> => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.flatten();

    const errorMessages = Object.entries(errors.fieldErrors)
      .map(([field, messages]) => {
        if (!messages || messages.length === 0) return null;

        const prettyField = field
          .replace(/_/g, " ")
          .replace(/^\w/, (c) => c.toUpperCase());

        return `${prettyField}: ${messages.join(", ")}`;
      })
      .filter(Boolean)
      .join(". ");

    const finalMessage =
      errorMessages || errors.formErrors.join(". ") || "Invalid input";

    throw new ValidationError({ message: finalMessage || "Invalid input" });
  }

  return result.data;
};

const validateRegister = (data: unknown) => validate(RegisterSchema, data);

const validateLogin = (data: unknown) => validate(LoginSchema, data);

const validateActivate = (data: unknown) => validate(ActivateSchema, data);

const validateSessionId = (data: unknown) => validate(SessionIdSchema, data);

const validateResendActivation = (data: unknown) =>
  validate(ResendActivationSchema, data);

const validateForgotPassword = (data: unknown) =>
  validate(ForgotPasswordSchema, data);

const validateResetPassword = (data: unknown) =>
  validate(ResetPasswordSchema, data);

const validator = {
  validateRegister,
  validateActivate,
  validateLogin,
  validateSessionId,
  validateResendActivation,
  validateForgotPassword,
  validateResetPassword,
};

export default validator;
