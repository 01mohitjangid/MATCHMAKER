
import { ageFromDob, formatHeight, formatIncome, fullName } from "@/lib/utils";
import type { Biodata, Candidate, Customer, MatchReason } from "@/types";

const API_KEY = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || "";
const USING_GROQ = Boolean(process.env.GROQ_API_KEY);
const BASE_URL =
  process.env.OPENAI_BASE_URL ||
  (USING_GROQ ? "https://api.groq.com/openai/v1" : "https://api.openai.com/v1");
const MODEL =
  process.env.OPENAI_MODEL ||
  (USING_GROQ ? "llama-3.3-70b-versatile" : "gpt-4o-mini");

export interface IntroResult {
  intro: string;
  /** Whether the text came from the LLM or the deterministic fallback. */
  source: "ai" | "fallback";
}

function highlights(reasons: MatchReason[]): string {
  const top = reasons
    .filter((r) => r.positive)
    .slice(0, 3)
    .map((r) => r.label.toLowerCase());
  if (top.length === 0) return "some promising common ground";
  if (top.length === 1) return top[0];
  return `${top.slice(0, -1).join(", ")} and ${top[top.length - 1]}`;
}

function profileLine(p: Biodata): string {
  return `${fullName(p)}, ${ageFromDob(p.dateOfBirth)}, ${p.designation} at ${p.currentCompany} in ${p.city} (${formatHeight(p.heightCm)}, ${formatIncome(p.incomeLPA)}, ${p.religion})`;
}

/** Deterministic, no-LLM intro — also the fallback. */
function templateIntro(
  client: Customer,
  candidate: Candidate,
  reasons: MatchReason[],
): string {
  return (
    `Hi ${client.firstName}, we'd love to introduce you to ${candidate.firstName}, ` +
    `a ${ageFromDob(candidate.dateOfBirth)}-year-old ${candidate.designation} based in ${candidate.city}. ` +
    `We think you two could really connect over ${highlights(reasons)}. ` +
    `If this feels right, we'll happily set up an introduction.`
  );
}

function buildPrompt(
  client: Customer,
  candidate: Candidate,
  reasons: MatchReason[],
): string {
  const reasonList = reasons
    .filter((r) => r.positive)
    .slice(0, 4)
    .map((r) => `- ${r.label}`)
    .join("\n");

  return [
    `You are introducing a potential match to a matchmaking client over email.`,
    ``,
    `CLIENT (the recipient): ${profileLine(client)}`,
    `SUGGESTED MATCH: ${profileLine(candidate)}`,
    ``,
    `Why they may be compatible:`,
    reasonList || "- general compatibility",
    ``,
    `Write a warm, personal 2–3 sentence intro the matchmaker can email the client,`,
    `addressed to ${client.firstName} by name, highlighting why ${candidate.firstName} could be a great match.`,
    `Keep it under 70 words, natural and human (no bullet points, no subject line, no sign-off).`,
  ].join("\n");
}

export async function generateIntro(
  client: Customer,
  candidate: Candidate,
  reasons: MatchReason[],
): Promise<IntroResult> {
  const fallback = templateIntro(client, candidate, reasons);
  if (!API_KEY) return { intro: fallback, source: "fallback" };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);

    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.7,
        max_tokens: 220,
        messages: [
          {
            role: "system",
            content:
              "You are a warm, tasteful matchmaker at The Date Crew. You write concise, sincere introductions. Never exaggerate or use clichés.",
          },
          { role: "user", content: buildPrompt(client, candidate, reasons) },
        ],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return { intro: fallback, source: "fallback" };
    const data = await res.json();
    const text: string | undefined = data?.choices?.[0]?.message?.content?.trim();
    return text ? { intro: text, source: "ai" } : { intro: fallback, source: "fallback" };
  } catch {
    return { intro: fallback, source: "fallback" };
  }
}
