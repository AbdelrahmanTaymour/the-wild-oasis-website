"use server";

import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";

export async function updateGuest(formData: FormData) {
  const session = await auth();
  if (!session || !session.user.guestId)
    throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID");
  const nationalityValue = formData.get("nationality");
  if (typeof nationalID !== "string") {
    throw new Error("National ID is required");
  }
  if (typeof nationalityValue !== "string") {
    throw new Error("Nationality is required");
  }
  const [nationality, countryFlag] = nationalityValue.split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");

  const updadedData = { nationality, countryFlag, nationalID };

  const { error } = await supabase
    .from("guests")
    .update(updadedData)
    .eq("id", session.user.guestId);

  if (error) throw new Error("Guest could not be updated");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
