import { createClient } from "@supabase/supabase-js";
import { readSupabaseConfiguration } from "./publicConfig";

const { url, publishableKey } = readSupabaseConfiguration(import.meta.env);

export const supabase = createClient(url, publishableKey);
