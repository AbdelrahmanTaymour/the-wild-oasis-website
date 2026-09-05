import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export const supabaseUrl = process.env.SUBABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
