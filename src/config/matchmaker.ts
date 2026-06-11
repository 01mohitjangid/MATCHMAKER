import type { Matchmaker } from "@/types";

/**
 * Demo matchmaker account. In a real system this would live behind a proper
 * auth provider — here it's a single hard-coded credential to keep the MVP
 * self-contained and easy to evaluate.
 *
 * Sample login (also documented in the README):
 *   username: priya
 *   password: tdc1234
 */
export const DEMO_MATCHMAKER: Matchmaker = {
  id: "MM-001",
  name: "Priya Nair",
  username: "priya",
  password: "tdc1234",
  email: "priya@thedatecrew.com",
  avatarSeed: "priya-nair-mm",
};
