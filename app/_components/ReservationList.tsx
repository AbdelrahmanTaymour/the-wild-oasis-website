"use client";

import { useOptimistic } from "react";
import { BookingWithCabin } from "../_lib/data-service";
import { deleteReservation } from "../_lib/actions";
import ReservationCard from "./ReservationCard";

type ReservationListProps = {
  bookings: BookingWithCabin[];
};

function ReservationList({ bookings }: ReservationListProps) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId) => {
      return curBookings.filter((booking) => booking.id !== bookingId);
    },
  );

  async function handleDelete(bookingId: number) {
    optimisticDelete(bookingId);
    await deleteReservation(bookingId);
  }

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking: BookingWithCabin) => (
        <ReservationCard
          booking={booking}
          onDelete={handleDelete}
          key={booking.id}
        />
      ))}
    </ul>
  );
}

export default ReservationList;
