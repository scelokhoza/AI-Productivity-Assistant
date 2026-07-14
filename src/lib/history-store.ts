import { useEffect, useState, useCallback } from "react";
import type { ToolKind } from "./ai-service";

export interface HistoryEntry {
  id: string;
  tool: ToolKind;
  title: string;
  prompt: string;
  output: string;
  createdAt: number;
}

const KEY = "flowmind:history:v1";

function read(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function write(entries: HistoryEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event("flowmind:history"));
}

export function addHistoryEntry(entry: Omit<HistoryEntry, "id" | "createdAt">) {
  const list = read();
  const full: HistoryEntry = { ...entry, id: crypto.randomUUID(), createdAt: Date.now() };
  write([full, ...list].slice(0, 100));
  return full;
}

export function clearHistory() {
  write([]);
}

export function removeHistoryEntry(id: string) {
  write(read().filter((e) => e.id !== id));
}

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const refresh = useCallback(() => setEntries(read()), []);
  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener("flowmind:history", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("flowmind:history", handler);
      window.removeEventListener("storage", handler);
    };
  }, [refresh]);
  return entries;
}