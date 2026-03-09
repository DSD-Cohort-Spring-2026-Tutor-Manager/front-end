"use client";
import { useMemo } from "react";
import "./LeastActiveStudents.css";

interface Session {
  studentId: string;
  studentName?: string;
  sessionStatus: string;
  datetimeStarted?: string;
}

interface Props {
  sessions: Session[];
  limit?: number;
}

interface StudentStat {
  studentId: string;
  studentName: string;
  total: number;
  completed: number;
  scheduled: number;
  lastSeen: string | null;
}

export default function LeastActiveStudents({ sessions, limit = 10 }: Props) {
  const rows = useMemo<StudentStat[]>(() => {
    const map = new Map<string, StudentStat>();

    sessions.forEach((s) => {
      const status = s.sessionStatus?.toLowerCase();
      if (status === "cancelled") return; // skip cancelled

      if (!map.has(s.studentId)) {
        map.set(s.studentId, {
          studentId: s.studentId,
          studentName: s.studentName ?? `Student ${s.studentId}`,
          total: 0,
          completed: 0,
          scheduled: 0,
          lastSeen: null,
        });
      }
      const entry = map.get(s.studentId)!;
      entry.total += 1;
      if (status === "completed") entry.completed += 1;
      if (status === "scheduled") entry.scheduled += 1;

      // Track most recent session date
      if (s.datetimeStarted) {
        const d = s.datetimeStarted.split("T")[0];
        if (!entry.lastSeen || d > entry.lastSeen) entry.lastSeen = d;
      }
    });

    return [...map.values()]
      .sort((a, b) => a.total - b.total) // least active first
      .slice(0, limit);
  }, [sessions, limit]);

  const maxTotal = rows[rows.length - 1]?.total || 1;

  const activityLevel = (total: number) => {
    const pct = total / maxTotal;
    if (pct <= 0.33) return { label: "Low",    color: "#ef4444", bg: "rgba(239, 68, 68, 0.12)" };
    if (pct <= 0.66) return { label: "Medium", color: "var(--Accent)", bg: "rgba(243, 156, 52, 0.12)"  };
    return              { label: "Good",   color: "var(--Highlight)", bg: "rgba(127, 191, 77, 0.12)"  };
  };

  const formatDate = (d: string | null) => {
    if (!d) return "Never";
    const diff = Math.floor(
      (Date.now() - new Date(d).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7)  return `${diff}d ago`;
    if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
    return `${Math.floor(diff / 30)}mo ago`;
  };

  return (
    <div className="las__root">
      {/* Header */}
      <div className="las__header">
        <div>
          <h3 className="las__title">Least Active Students</h3>
          <p className="las__subtitle">Bottom {limit} by session count · excl. cancelled</p>
        </div>
        <span className="las__badge">{rows.length} students</span>
      </div>

      {/* Column headers */}
      <div className="las__col-heads">
        <span className="las__col-rank">#</span>
        <span className="las__col-student">Student</span>
        <span className="las__col-sessions">Sessions</span>
        <span className="las__col-activity">Activity</span>
        <span className="las__col-last">Last Active</span>
      </div>

      {/* Rows */}
      <ul className="las__list">
        {rows.map((s, i) => {
          const level = activityLevel(s.total);
          const barPct = Math.max(4, (s.total / maxTotal) * 100);

          return (
            <li key={s.studentId} className="las__row">
              {/* Rank */}
              <span className="las__rank">{i + 1}</span>

              {/* Avatar + name */}
              <div className="las__student">
                <div className="las__avatar">
                  {s.studentName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="las__name">{s.studentName}</p>
                  <p className="las__id">ID {s.studentId}</p>
                </div>
              </div>

              {/* Session bar + count */}
              <div className="las__sessions">
                <div className="las__bar-wrap">
                  <div
                    className="las__bar-fill"
                    style={{ width: `${barPct}%`, background: level.color }}
                  />
                </div>
                <span className="las__count">{s.total}</span>
              </div>

              {/* Activity pill */}
              <div className="las__activity-col">
                <span
                  className="las__pill"
                  style={{ color: level.color, background: level.bg }}
                >
                  {level.label}
                </span>
              </div>

              {/* Last seen */}
              <span className="las__last">{formatDate(s.lastSeen)}</span>
            </li>
          );
        })}

        {rows.length === 0 && (
          <li className="las__empty">No session data available.</li>
        )}
      </ul>

      {/* Footer breakdown */}
      <div className="las__footer">
        <div className="las__legend">
          <span className="las__legend-dot" style={{ background: "#ef4444" }} /> Low
        </div>
        <div className="las__legend">
          <span className="las__legend-dot" style={{ background: "var(--Accent)" }} /> Medium
        </div>
        <div className="las__legend">
          <span className="las__legend-dot" style={{ background: "var(--Highlight)" }} /> Good
        </div>
        <span className="las__legend-note">relative to group max ({rows[rows.length - 1]?.total ?? 0} sessions)</span>
      </div>
    </div>
  );
}