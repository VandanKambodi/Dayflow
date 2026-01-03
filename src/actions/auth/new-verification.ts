"use server";
import { getUserByEmail } from "@/data/user";
import { getVerifationTokenByToken } from "@/data/verification-token";
import { db } from "@/lib/db";

export const newVerification = async (token: string) => {
  // Validate token input
  if (!token || token.trim() === "") {
    return { error: "Token is missing or invalid" };
  }

  const existingToken = await getVerifationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist or has already been used!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    // Delete expired token
    await db.token
      .delete({
        where: { id: existingToken.id },
      })
      .catch(() => null);
    return {
      error: "Token has expired! Please request a new verification link.",
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "User does not exist!" };
  }

  if (existingUser.emailVerified) {
    return { error: "Email already verified!" };
  }

  if (existingUser.image !== null) {
    return { error: "You are registered with google" };
  }

  try {
    await db.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        emailVerified: new Date(),
      },
    });

    await db.token.delete({
      where: {
        id: existingToken.id,
      },
    });

    return { success: "Email verified successfully!" };
  } catch (e) {
    console.error("Error in EmailVerification:", e);
    return { error: "Error verifying email. Please try again." };
  }
};
