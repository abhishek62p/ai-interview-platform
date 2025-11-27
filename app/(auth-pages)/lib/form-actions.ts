"use server";

import { signUpFormSchema, LoginSchema } from "./form-schema";
import z from "zod";
import { signIn, signOut } from "../auth";
import { AuthError } from "next-auth";
import { CreateNewUser, getUserByEmail } from "@/app/lib/users";
import { FormState } from "@/app/components/auth/auth-form";

export async function handleLoginUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const userData = {
    email: formData.get("email"),
    password: formData.get("password"),
    role: (formData.get("role") as string) || "",
  };

  try {
    await LoginSchema.parseAsync(userData);

    const roleUpper = (userData.role as string)?.toUpperCase();
    if (!roleUpper || !["CANDIDATE", "HR"].includes(roleUpper)) {
      return {
        success: false,
        errors: { role: "Please select your role (Candidate or HR)" },
      };
    }

    const result: any = await signIn("credentials", {
      email: userData.email,
      password: userData.password,
      role: roleUpper,
      redirect: false,
      redirectTo: "/",
    });

    if (!result || (result as any)?.error) {
      return {
        success: false,
        errors: { general: "Invalid email, password, or role" },
      };
    }

    return { success: true };
  } catch (err) {
    console.log(err);
    if (err instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      Object.entries(err.flatten().fieldErrors).forEach(([field, messages]) => {
        if (messages && messages.length > 0) {
          fieldErrors[field] = messages[0];
        }
      });
      return {
        success: false,
        errors: fieldErrors,
      };
    } else if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          // Could be wrong password or role mismatch; return generic message
          return {
            success: false,
            errors: {
              general: "Invalid email, password, or role",
            },
          };
      }
    }
  }
  return {
    success: false,
    errors: {
      general: "Something went wrong",
    },
  };
}

export async function handleSignUpUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const emailLower = String(formData.get("email") || "")
      .trim()
      .toLowerCase();
    const userData = {
      fullname: formData.get("fullname"),
      email: emailLower,
      password: formData.get("password"),
      confirmpassword: formData.get("confirmpassword"),
      role: formData.get("role") || "",
    };

    await signUpFormSchema.parseAsync(userData);
    const roleUpper = String(userData.role || "").toUpperCase();
    if (!roleUpper || !["CANDIDATE", "HR"].includes(roleUpper)) {
      return {
        success: false,
        errors: { role: "Please select your role (Candidate or HR)" },
      };
    }
    const userExists = await getUserByEmail(userData.email as string);

    if (userExists) {
      return {
        success: false,
        errors: {
          general: "Email already registered. Please log in.",
        },
      };
    }

    await CreateNewUser({ ...userData, role: roleUpper });

    return { success: true };
  } catch (err) {
    console.error("Signup error:", err);
    if (err instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};

      Object.entries(err.flatten().fieldErrors).forEach(([field, messages]) => {
        if (messages && messages.length > 0) {
          fieldErrors[field] = messages[0];
        }
      });

      return {
        success: false,
        errors: fieldErrors,
      };
    }

    // Prisma unique constraint violation (email)
    if (typeof err === "object" && err && (err as any).code === "P2002") {
      return {
        success: false,
        errors: { general: "Email already registered. Please log in." },
      };
    }

    return {
      success: false,
      errors: {
        general: "Something went wrong. Please try again.",
      },
    };
  }
}
