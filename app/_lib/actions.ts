"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

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

  revalidatePath("/account/profile");
}

export async function deleteReservation(bookingId: number) {
  const session = await auth();
  if (!session || !session.user.guestId)
    throw new Error("You must be logged in");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingsIds.includes(bookingId))
    throw new Error("You're not allowed to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");

  revalidatePath("/account/reservations");
}

export async function updateBooking(formData: FormData) {
  const bookingId = Number(formData.get("bookingId"));

  const session = await auth();
  if (!session || !session.user.guestId)
    throw new Error("You must be logged in");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingsIds.includes(bookingId))
    throw new Error("You're not allowed to update this booking");

  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: String(formData.get("observations") ?? "").slice(0, 1000),
  };

  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();

  if (error) throw new Error("Booking could not be updated");

  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");

  redirect("/account/reservations");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
