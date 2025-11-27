"use server";

import { signUpFormSchema, LoginSchema } from "./form-schema";
import z from "zod";
import { signIn, signOut } from "../auth";
import { AuthError } from "next-auth";
import { CreateNewUser, getUserByEmail } from "@/app/lib/users";
import { FormState } from "@/app/components/auth/auth-form";
import { redirect } from "next/navigation";

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

    try {
      const result = await signIn("credentials", {
        email: userData.email,
        password: userData.password,
        role: roleUpper,
        redirect: false,
      });

      // Check if sign-in failed
      if (result?.error) {
        console.error("Sign-in error:", result.error);
        return {
          success: false,
          errors: {
            general: "Invalid email, password, or role",
          },
        };
      }

      // If we reach here, authentication succeeded
      redirect("/dashboard");
    } catch (signInErr: any) {
      // Check if it's a redirect error (which means success)
      if (signInErr?.digest?.includes('NEXT_REDIRECT')) {
        throw signInErr; // Re-throw to allow the redirect
      }
      
      // Handle any auth-related errors (CallbackRouteError, etc.)
      console.error("SignIn threw error:", signInErr);
      return {
        success: false,
        errors: {
          general: "Invalid email, password, or role",
        },
      };
    }
  } catch (err) {
    console.error("Login error:", err);
    
    // Check if it's a redirect error (which means success)
    if ((err as any)?.digest?.includes('NEXT_REDIRECT')) {
      throw err; // Re-throw to allow the redirect
    }
    
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

    // Automatically sign in the user after successful signup
    try {
      const result = await signIn("credentials", {
        email: userData.email,
        password: userData.password,
        role: roleUpper,
        redirect: false,
      });

      if (!result?.error) {
        redirect("/dashboard");
      }
    } catch (redirectErr) {
      // Check if it's a redirect error (which means success)
      if ((redirectErr as any)?.digest?.includes('NEXT_REDIRECT')) {
        throw redirectErr; // Re-throw to allow the redirect
      }
      // If auto-login fails, still show success message
      console.error("Auto-login after signup failed:", redirectErr);
    }

    return { success: true };
  } catch (err) {
    console.error("Signup error:", err);
    
    // Check if it's a redirect error (which means success)
    if ((err as any)?.digest?.includes('NEXT_REDIRECT')) {
      throw err; // Re-throw to allow the redirect
    }
    
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
