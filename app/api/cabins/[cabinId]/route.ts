import { getBookedDatesByCabinId, getCabin } from "@/app/_lib/data-service";

interface RouteParams {
  params: Promise<{
    cabinId: number;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { cabinId } = await params;

  try {
    const [cabin, bookedDates] = await Promise.all([
      getCabin(cabinId),
      getBookedDatesByCabinId(cabinId),
    ]);

    return Response.json({ cabin, bookedDates });
  } catch {
    return Response.json({ message: "Cabin not found" }, { status: 404 });
  }
}
