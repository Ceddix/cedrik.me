'use cache';
import { cacheLife } from "next/cache";
import { SITE_CONFIG } from "@/app/lib/config";

export async function getAge() {
  cacheLife('days');
  return new Date(Date.now() - SITE_CONFIG.dob.getTime()).getUTCFullYear() - 1970;
}

