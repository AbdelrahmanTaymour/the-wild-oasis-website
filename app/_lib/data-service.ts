import { eachDayOfInterval } from "date-fns";
import { supabase } from "./supabase";

import type {
  Booking,
  BookingInsert,
  BookingUpdate,
  Cabin,
  Guest,
  GuestInsert,
  GuestUpdate,
  Settings,
} from "./database";
import { CabinCardData } from "../cabins/types";

/////////////
// GET

export async function getCabin(id: number): Promise<Cabin> {
  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Cabin could not be loaded");
  }

  return data;
}

export async function getCabinPrice(
  id: number,
): Promise<Pick<Cabin, "regularPrice" | "discount">> {
  const { data, error } = await supabase
    .from("cabins")
    .select("regularPrice, discount")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Cabin price could not be loaded");
  }

  return data;
}

export async function getCabins(): Promise<CabinCardData[]> {
  const { data, error } = await supabase
    .from("cabins")
    .select("id, name, maxCapacity, regularPrice, discount, image")
    .order("name");

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

// Guests are uniquely identified by their email address
export async function getGuest(email: string): Promise<Guest | null> {
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be loaded");
  }

  return data;
}

export async function getBooking(id: number): Promise<Booking> {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be loaded");
  }

  return data;
}

/////////////
// JOIN TYPES

export interface BookingWithCabin {
  id: number;
  created_at: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  totalPrice: number;
  status: string;
  guestId: number;
  cabinId: number;
  cabins: {
    name: string;
    image: string;
  };
}

export async function getBookings(
  guestId: number,
): Promise<BookingWithCabin[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
        id,
        created_at,
        startDate,
        endDate,
        numNights,
        numGuests,
        status,
        totalPrice,
        guestId,
        cabinId,
        cabins(name, image)
      `,
    )
    .eq("guestId", guestId)
    .order("startDate");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded");
  }

  return data;
}

export async function getBookedDatesByCabinId(
  cabinId: number,
): Promise<Date[]> {
  const today = new Date();

  today.setUTCHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("bookings")
    .select("startDate, endDate")
    .eq("cabinId", cabinId)
    .or(`startDate.gte.${today.toISOString()},status.eq.checked-in`);

  if (error) {
    console.error(error);
    throw new Error("Bookings could not be loaded");
  }

  return data.flatMap((booking) =>
    eachDayOfInterval({
      start: new Date(booking.startDate),
      end: new Date(booking.endDate),
    }),
  );
}

export async function getSettings(): Promise<Settings> {
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }

  return data;
}

/////////////
// COUNTRIES

type Country = {
  name: string;
  flag: string;
};

type RestCountriesResponse = {
  data: {
    objects: {
      names: {
        common: string;
      };
      flag: {
        emoji: string;
      };
    }[];
  };
};

export async function getCountries(): Promise<Country[]> {
  try {
    const response = await fetch(
      "https://api.restcountries.com/countries/v5?response_fields=names.common,flag.emoji&limit=100",
      {
        headers: {
          Authorization: `Bearer ${process.env.RESTCOUNTRIES_KEY}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch countries");
    }

    const result: RestCountriesResponse = await response.json();

    console.log("Fetched countries:", result.data.objects);

    return result.data.objects.map((country) => ({
      name: country.names.common,
      flag: country.flag.emoji,
    }));
  } catch {
    throw new Error("Could not fetch countries");
  }
}

/////////////
// CREATE

export async function createGuest(newGuest: GuestInsert): Promise<Guest> {
  const { data, error } = await supabase
    .from("guests")
    .insert(newGuest)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  return data;
}

export async function createBooking(
  newBooking: BookingInsert,
): Promise<Booking> {
  const { data, error } = await supabase
    .from("bookings")
    .insert(newBooking)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  return data;
}

/////////////
// UPDATE

export async function updateGuest(
  id: number,
  updatedFields: GuestUpdate,
): Promise<Guest> {
  const { data, error } = await supabase
    .from("guests")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }

  return data;
}

export async function updateBooking(
  id: number,
  updatedFields: BookingUpdate,
): Promise<Booking> {
  const { data, error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  return data;
}

/////////////
// DELETE

export async function deleteBooking(id: number): Promise<void> {
  const { error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
}
