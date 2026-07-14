// Mock AI service — simulates realistic AI responses with delay.
// Academic prototype: no backend calls, deterministic-ish templated outputs.

export type ToolKind = "email" | "summary" | "tasks" | "research" | "chat";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export interface EmailInput {
  purpose: string;
  audience: string;
  tone: string;
  keyPoints: string;
}

export async function generateEmail(input: EmailInput): Promise<string> {
  await wait(900 + Math.random() * 700);
  const points = input.keyPoints
    .split(/\n|,|;/)
    .map((s) => s.trim())
    .filter(Boolean);
  const subjectOpts = [
    `Quick note: ${input.purpose}`,
    `Following up on ${input.purpose}`,
    `${input.purpose} — next steps`,
    `Update regarding ${input.purpose}`,
  ];
  const subject = pick(subjectOpts, hash(input.purpose + input.audience));
  const greeting =
    input.tone.toLowerCase().includes("formal") ? `Dear ${input.audience},` : `Hi ${input.audience},`;
  const bodyIntro =
    input.tone.toLowerCase().includes("friendly")
      ? `Hope you're doing well! I wanted to reach out regarding ${input.purpose}.`
      : `I'm writing to you regarding ${input.purpose}.`;
  const bulletList =
    points.length > 0
      ? `\n\nA few key points I wanted to highlight:\n${points.map((p) => `  • ${p}`).join("\n")}`
      : "";
  const cta = `Could we schedule a brief 15-minute call this week to discuss? I'm available Tuesday or Thursday afternoon.`;
  const closing = input.tone.toLowerCase().includes("formal")
    ? "Best regards,\n[Your Name]"
    : "Thanks,\n[Your Name]";
  return `Subject: ${subject}\n\n${greeting}\n\n${bodyIntro}${bulletList}\n\n${cta}\n\n${closing}\n\n---\nSuggested call-to-action: ${cta}`;
}

export async function summarizeNotes(notes: string): Promise<string> {
  await wait(1000 + Math.random() * 800);
  const sentences = notes.split(/[.\n]/).map((s) => s.trim()).filter((s) => s.length > 8);
  const first = sentences.slice(0, 2).join(". ") || "The meeting covered key project updates and next steps.";
  const keyPoints = sentences.slice(0, 4).map((s, i) => `  ${i + 1}. ${s}`).join("\n") ||
    "  1. Team aligned on quarterly goals\n  2. Reviewed current blockers\n  3. Agreed on next milestones";
  return `## Executive Summary
${first}.

## Key Discussion Points
${keyPoints}

## Action Items
  • Owner A — draft revised proposal by end of week
  • Owner B — coordinate with engineering on scope
  • Owner C — schedule follow-up review

## Deadlines
  • Draft review: within 5 business days
  • Final decision: end of the sprint

## Risks / Blockers
  • Dependency on external vendor timeline
  • Resource allocation across parallel workstreams`;
}

export interface TasksInput {
  tasks: string;
  deadlines: string;
  context: string;
}

export async function planTasks(input: TasksInput): Promise<string> {
  await wait(900 + Math.random() * 700);
  const items = input.tasks.split(/\n|,|;/).map((t) => t.trim()).filter(Boolean);
  const prioritized = items.map((t, i) => {
    const p = i === 0 ? "P0 — Urgent" : i === 1 ? "P1 — High" : i < 4 ? "P2 — Medium" : "P3 — Low";
    return `  ${i + 1}. [${p}] ${t}`;
  }).join("\n") || "  1. [P1 — High] Define scope and success criteria\n  2. [P2 — Medium] Draft initial timeline";
  return `## Prioritized Tasks
${prioritized}

## Suggested Schedule
  • Morning (9–11 AM): Deep-focus work on top-priority item
  • Late morning (11 AM–12 PM): Communication & alignment
  • Afternoon (1–4 PM): Execution on P1/P2 items
  • End of day (4–5 PM): Review, wrap-up, plan tomorrow

## Urgent Items
  • ${items[0] ?? "Top-priority task"} — flagged based on: ${input.deadlines || "context"}

## Recommendations
  • Batch similar tasks to reduce context-switching
  • Reserve at least one 90-minute deep-work block
  • Reassess priorities mid-day based on progress
${input.context ? `\nContext considered: ${input.context}` : ""}`;
}

export interface ResearchInput {
  topic: string;
  goal: string;
  outcome: string;
}

export async function researchTopic(input: ResearchInput): Promise<string> {
  await wait(1100 + Math.random() * 800);
  return `## Key Insights on "${input.topic}"
  • Current landscape shows accelerating adoption and rising competitive pressure
  • Three dominant approaches have emerged, each with distinct trade-offs
  • Regulatory and ethical considerations are increasingly shaping strategy
  • Early movers are consolidating advantage through data and integrations

## Summary
Based on the goal — "${input.goal}" — the most relevant angle is to focus on measurable, high-leverage moves that fit your current capacity. The desired outcome ("${input.outcome}") suggests prioritizing near-term wins while laying groundwork for longer-term differentiation.

## Recommendations
  1. Run a short discovery cycle (1–2 weeks) with 3–5 stakeholder interviews
  2. Benchmark two comparable case studies to calibrate expectations
  3. Draft a lightweight pilot with clear success metrics before broad rollout
  4. Establish a review cadence to iterate quickly on early signals

## Next Steps
  • This week: gather baseline data and define success metrics
  • Next 2 weeks: run pilot with a small cohort
  • Week 4: review outcomes and decide on scale-up`;
}

const chatResponses = [
  "Here's a draft you can adapt — I've kept the tone professional and concise:\n\nHi [Name],\n\nJust following up on our recent conversation. I wanted to check in on next steps and see if there's anything I can help move forward this week. Happy to jump on a quick call at your convenience.\n\nBest,\n[You]",
  "Great — here's a structured summary of the notes:\n\n**Highlights**\n  • Team aligned on Q3 priorities\n  • Two blockers identified around resourcing\n  • Next review scheduled\n\n**Action items**\n  • Owner A: revise proposal\n  • Owner B: unblock vendor dependency",
  "Here's a lightweight project plan:\n\n**Week 1** — Discovery & scoping\n**Week 2** — Design & stakeholder review\n**Week 3–4** — Build phase 1\n**Week 5** — Pilot & feedback\n**Week 6** — Iterate & roll out\n\nWant me to break down any phase into daily tasks?",
  "Here's what I'd focus on for that topic:\n\n1. Map the competitive landscape — who's winning and why\n2. Identify 2–3 real customer pains you can validate quickly\n3. Prototype a minimal solution and get 5 conversations\n4. Decide: double down, pivot, or park\n\nWant me to draft interview questions?",
];

export async function chatReply(message: string, history: { role: string; content: string }[]): Promise<string> {
  await wait(700 + Math.random() * 900);
  const m = message.toLowerCase();
  if (m.includes("email") || m.includes("follow-up") || m.includes("follow up")) return chatResponses[0];
  if (m.includes("summar") || m.includes("notes")) return chatResponses[1];
  if (m.includes("plan") || m.includes("project") || m.includes("schedule") || m.includes("task")) return chatResponses[2];
  if (m.includes("research") || m.includes("market") || m.includes("competitor")) return chatResponses[3];
  const seed = hash(message + history.length);
  return `${pick(
    [
      "Happy to help with that.",
      "Good question — here's how I'd approach it.",
      "Let's break this down.",
    ],
    seed,
  )}\n\n${pick(chatResponses, seed)}`;
}

export const DISCLAIMER = "AI-generated content may require human review.";