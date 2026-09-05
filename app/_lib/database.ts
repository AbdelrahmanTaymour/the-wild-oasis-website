import type { Database } from "./database.types";

export type Cabin = Database["public"]["Tables"]["cabins"]["Row"];
export type CabinInsert = Database["public"]["Tables"]["cabins"]["Insert"];
export type CabinUpdate = Database["public"]["Tables"]["cabins"]["Update"];

export type Guest = Database["public"]["Tables"]["guests"]["Row"];
export type GuestInsert = Database["public"]["Tables"]["guests"]["Insert"];
export type GuestUpdate = Database["public"]["Tables"]["guests"]["Update"];

export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];
export type BookingUpdate = Database["public"]["Tables"]["bookings"]["Update"];

export type Settings = Database["public"]["Tables"]["settings"]["Row"];
