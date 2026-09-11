"use client";

import { DayPicker, type DateRange } from "@daypicker/react";
import "@daypicker/react/style.css";
import { isWithinInterval } from "date-fns";
import { Cabin, Settings } from "../_lib/database";

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
  // Static placeholder variables (Replace with your actual state or props)
  const regularPrice = 23;
  const discount = 23;
  const numNights = 23;
  const cabinPrice = 23;
  const range: DateRange = { from: undefined, to: undefined };

  // Dummy function for reset behavior
  const resetRange = () => {
    console.log("Range reset");
  };

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
        min={minBookingLength + 1}
        max={maxBookingLength}
        startMonth={new Date()}
        endMonth={new Date(endYear, 11)}
        captionLayout="dropdown"
        numberOfMonths={2}
        // Custom classes to force active colors, custom hover highlights, and crisp white arrows
        classNames={{
          months: "flex gap-12",
          month: "space-y-4",
          month_caption:
            "flex justify-center pt-1 relative items-center text-primary-200 font-semibold mb-4 capitalize gap-1",
          weeks: "w-full border-collapse space-y-1",
          weekdays:
            "flex justify-between text-primary-400 font-medium text-xs uppercase tracking-wider mb-2",
          weekday: "w-9 text-center",
          week: "flex w-full mt-2 justify-between",

          // Day structural baseline layout + Hover controls matching the requested palette accents
          today: "text-primary-300",
          day: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20 inline-flex items-center justify-center rounded-full hover:bg-accent-500 hover:text-primary-900 border border-transparent hover:border-accent-400 transition-all font-semibold text-primary-100",

          // Selected Ranges matching accent state requirements
          selected: "bg-accent-500 text-primary-900 font-bold rounded-full",
          range_start: "bg-accent-500 text-primary-900 rounded-full font-bold",
          range_end: "bg-accent-500 text-primary-900 rounded-full font-bold",
          range_middle:
            "bg-accent-500/80 text-primary-900 rounded-full font-semibold",
          outside: "text-primary-600 opacity-50",
          disabled:
            "text-primary-600 line-through opacity-30 cursor-not-allowed",
          hidden: "invisible",

          // Side navigation arrows
          nav: "flex items-center justify-between absolute w-full px-4 top-14 left-0 right-0 pointer-events-none z-10 ",
          button_previous:
            "pointer-events-auto cursor-pointer p-1 [&_svg]:!fill-white [&_svg]:text-white hover:[&_svg]:text-accent-400 transition-colors",
          button_next:
            "pointer-events-auto cursor-pointer p-1 [&_svg]:!fill-white [&_svg]:text-white hover:[&_svg]:text-accent-400 transition-colors",
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

        {range.from || range.to ? (
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
