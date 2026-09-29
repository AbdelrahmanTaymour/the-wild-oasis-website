import { getBookedDatesByCabinId, getCabin } from "@/app/_lib/data-service";

interface RouteParams {
  params: Promise<{
    cabinId: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { cabinId } = await params;
  const id = Number(cabinId);

  try {
    const [cabin, bookedDates] = await Promise.all([
      getCabin(id),
      getBookedDatesByCabinId(id),
    ]);

    return Response.json({ cabin, bookedDates });
  } catch {
    return Response.json({ message: "Cabin not found" }, { status: 404 });
  }
}
