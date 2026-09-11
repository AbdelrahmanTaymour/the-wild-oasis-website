import { getBookedDatesByCabinId, getSettings } from "../_lib/data-service";
import { Cabin } from "../_lib/database";
import DateSelector from "./DateSelector";
import ReservationForm from "./ReservationForm";

async function Reservation({ cabin }: { cabin: Cabin }) {
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
  ]);

  return (
    <div>
      <div className="grid grid-cols-2 border border-primary-800 min-h-100">
        <DateSelector
          settings={settings}
          bookedDates={bookedDates}
          cabin={cabin}
        />
        <ReservationForm cabin={cabin} />
      </div>
    </div>
  );
}

export default Reservation;
