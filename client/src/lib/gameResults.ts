import type { RoomState } from "./store";

const KEY = "kc_game_results";

export type GameResult = {
  id: string;
  roomCode: string;
  gameTitle: string;
  finishedAt: number;
  durationMs: number;
  team1: { name: string; color: string; score: number; cells: number };
  team2: { name: string; color: string; score: number; cells: number };
  winnerTeam: 0 | 1 | 2;
  winnerName: string;
  totalCells: number;
  usedCells: number;
  totalQuestions: number;
  participants: number;
  participantNames: string[];
  unansweredQuestions: number;
};

function safeRead(): GameResult[] {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr as GameResult[]) : [];
  } catch { return []; }
}

function safeWrite(list: GameResult[]) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch { /* ignore */ }
}

export function loadGameResults(): GameResult[] {
  return safeRead().sort((a, b) => b.finishedAt - a.finishedAt);
}

export function saveGameResult(room: RoomState): GameResult {
  const players = Object.values(room.players || {});
  const t1Cells = room.board.filter((c) => c.claimedBy === 1).length;
  const t2Cells = room.board.filter((c) => c.claimedBy === 2).length;
  const used = room.board.filter((c) => c.used || c.claimedBy !== 0).length;
  const totalCells = room.board.length;
  const totalQuestions = room.board.reduce((n, c) => {
    const bank = (c as any).questionBank;
    if (Array.isArray(bank) && bank.length) return n + bank.length;
    return n + (c.question?.trim() ? 1 : 0);
  }, 0);

  const winnerTeam = room.winnerTeam || 0;
  const winnerName =
    winnerTeam === 1
      ? room.team1.name
      : winnerTeam === 2
        ? room.team2.name
        : "تعادل";

  const result: GameResult = {
    id: `r_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    roomCode: room.roomCode,
    gameTitle: room.gameTitle || "وصلة المعرفة",
    finishedAt: Date.now(),
    durationMs: Math.max(0, Date.now() - (room.createdAt || Date.now())),
    team1: { name: room.team1.name, color: room.team1.color, score: room.team1Score, cells: t1Cells },
    team2: { name: room.team2.name, color: room.team2.color, score: room.team2Score, cells: t2Cells },
    winnerTeam,
    winnerName,
    totalCells,
    usedCells: used,
    totalQuestions,
    participants: players.length,
    participantNames: players.map((p) => p.name).slice(0, 60),
    unansweredQuestions: Math.max(0, totalCells - used),
  };

  const next = [result, ...safeRead()].slice(0, 50);
  safeWrite(next);
  return result;
}

export function deleteGameResult(id: string) {
  const next = safeRead().filter((r) => r.id !== id);
  safeWrite(next);
}

export function clearGameResults() {
  safeWrite([]);
}

export function exportResultsJSON(): string {
  return JSON.stringify(loadGameResults(), null, 2);
}

export function exportResultsCSV(): string {
  const rows: string[] = [];
  rows.push(["معرف","عنوان اللعبة","الرمز","التاريخ","الفائز","نتيجة الفريق ١","نتيجة الفريق ٢","مشاركون","أسئلة"].join(","));
  const esc = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  for (const r of loadGameResults()) {
    rows.push([
      esc(r.id),
      esc(r.gameTitle),
      esc(r.roomCode),
      esc(new Date(r.finishedAt).toISOString()),
      esc(r.winnerName),
      String(r.team1.score),
      String(r.team2.score),
      String(r.participants),
      String(r.totalQuestions),
    ].join(","));
  }
  return "﻿" + rows.join("\n");
}

export function summarizeResult(r: GameResult): string {
  const date = new Date(r.finishedAt).toLocaleString("ar");
  return [
    `لعبة: ${r.gameTitle}`,
    `الرمز: ${r.roomCode}`,
    `التاريخ: ${date}`,
    `الفائز: ${r.winnerName}`,
    `${r.team1.name}: ${r.team1.score} نقطة (${r.team1.cells} حرف)`,
    `${r.team2.name}: ${r.team2.score} نقطة (${r.team2.cells} حرف)`,
    `عدد المشاركين: ${r.participants}`,
    `عدد الأسئلة الكلية: ${r.totalQuestions}`,
  ].join("\n");
}

export function aggregateResults(results: GameResult[]) {
  if (!results.length) {
    return {
      totalGames: 0,
      totalParticipants: 0,
      mostWinningTeamName: "—",
      lastGameTitle: "—",
      lastGameDate: "—",
      avgQuestions: 0,
    };
  }
  const teamWins = new Map<string, number>();
  let totalParticipants = 0;
  let qSum = 0;
  for (const r of results) {
    if (r.winnerTeam !== 0) {
      const name = r.winnerTeam === 1 ? r.team1.name : r.team2.name;
      teamWins.set(name, (teamWins.get(name) || 0) + 1);
    }
    totalParticipants += r.participants;
    qSum += r.totalQuestions;
  }
  let topName = "—";
  let topCount = 0;
  teamWins.forEach((count, name) => {
    if (count > topCount) { topCount = count; topName = name; }
  });
  const last = results[0];
  return {
    totalGames: results.length,
    totalParticipants,
    mostWinningTeamName: topName,
    lastGameTitle: last.gameTitle,
    lastGameDate: new Date(last.finishedAt).toLocaleDateString("ar"),
    avgQuestions: Math.round(qSum / results.length),
  };
}
