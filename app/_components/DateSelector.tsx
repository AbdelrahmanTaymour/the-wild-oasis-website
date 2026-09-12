"use client";

import { DayPicker, type DateRange } from "@daypicker/react";
import "@daypicker/react/style.css";
import { isWithinInterval } from "date-fns";
import { Cabin, Settings } from "../_lib/database";
import { useReservation } from "../contexts/ReservationContext";

// Properly type the helper arguments
function isAlreadyBooked(range: DateRange, datesArr: Date[]): boolean {
  return !!(
    range.from &&
    range.to &&
    datesArr.some((date) =>
      isWithinInterval(date, { start: range.from!, end: range.to! }),
    )
  );
}

function DateSelector({
  settings,
  bookedDates,
  cabin,
}: {
  settings: Settings;
  bookedDates: Date[];
  cabin: Cabin;
}) {
  const { range, setRange, resetRange } = useReservation() as {
    range: DateRange | undefined;
    setRange: (range: DateRange | undefined) => void;
    resetRange: () => void;
  };

  // Static placeholder variables (Replace with your actual state or props)
  const regularPrice = 23;
  const discount = 23;
  const numNights = 23;
  const cabinPrice = 23;

  // SETTINGS
  const { minBookingLength, maxBookingLength } = settings;
  if (minBookingLength === null || maxBookingLength === null)
    throw new Error("Unable to fetch settings");

  // Compute end year bounds
  const endYear = new Date().getFullYear() + 5;

  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        className="pt-12 place-self-center"
        mode="range"
        onSelect={setRange}
        selected={range}
        min={minBookingLength + 1}
        max={maxBookingLength}
        startMonth={new Date()}
        endMonth={new Date(endYear, 11)}
        captionLayout="dropdown"
        numberOfMonths={2}
        classNames={{
          // ─────────────────────────────────────────────
          // MONTHS
          // ─────────────────────────────────────────────
          months: "flex gap-12",
          month: "space-y-4",
          month_caption: "flex justify-center items-center h-8 mb-3",
          caption_label: "sr-only",
          dropdowns: "flex items-center justify-center gap-1",
          dropdown_root: "group flex items-center rounded-md",
          dropdown:
            "cursor-pointer rounded-md border border-transparent bg-transparent px-2 py-1 text-lg font-semibold text-primary-100 outline-none transition-colors hover:bg-accent-600 hover:text-white",

          // ─────────────────────────────────────────────
          // NAVIGATION
          // ─────────────────────────────────────────────
          nav: "hidden",
          button_previous: "hidden",
          button_next: "hidden",

          // ─────────────────────────────────────────────
          // CALENDAR
          // ─────────────────────────────────────────────
          month_grid: "w-full border-collapse",
          weekdays:
            "flex justify-between text-primary-300 font-semibold text-xs uppercase tracking-wide mb-2",
          weekday: "w-9 text-center",
          week: "flex w-full mt-1 justify-between",
          today: "!text-accent-300 hover:!text-primary-900",
          day: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20 inline-flex items-center justify-center rounded-full hover:bg-accent-500 hover:text-primary-900 border-transparent hover:border-accent-400 font-semibold text-primary-300",

          // ─────────────────────────────────────────────
          // RANGE
          // ─────────────────────────────────────────────
          selected: "bg-accent-500 text-primary-900 font-semibold",
          range_start: "rounded-l-full rounded-r-none",
          range_middle: "rounded-none",
          range_end: "rounded-r-full rounded-l-none",
        }}
      />

      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-18">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {range?.from || range?.to ? (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
            onClick={resetRange}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;
