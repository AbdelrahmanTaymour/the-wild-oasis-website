import { Cabin } from "../_lib/database";

export type CabinCardData = Pick<
  Cabin,
  "id" | "name" | "maxCapacity" | "regularPrice" | "discount" | "image"
>;
