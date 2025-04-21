// lib/drupal.ts
import { DrupalClient } from "next-drupal"

export const drupal = new DrupalClient("http://drupal.ddev.site") // use http for local dev
