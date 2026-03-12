"use client";
import { useMemo, useEffect, useState } from "react";
import "./LeastActiveStudents.css";
import { TutortoiseClient } from "../../_api/tutortoiseClient";

interface Session {
  studentId: string;
  studentFirstName?: string;
  studentLastName?: string;
  parentId: string | null;
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
  parentId: string | null;
  total: number;
  completed: number;
  scheduled: number;
  lastSeen: string | null;
}
interface ParentRecord {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentCreditAmount: number;
  numberOfStudents: number;
}

export default function LeastActiveStudents({ sessions, limit = 10 }: Props) {
  const [parentEmails, setParentEmails] = useState<Record<string, string>>({});

  const rows = useMemo<StudentStat[]>(() => {
    const map = new Map<string, StudentStat>();

    sessions.forEach((s) => {
      const status = s.sessionStatus?.toLowerCase();

      if (!map.has(s.studentId)) {
        map.set(s.studentId, {
          studentId: s.studentId,
          studentName:
            `${s.studentFirstName ?? ""} ${s.studentLastName ?? ""}`.trim(),
          parentId: s.parentId,
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
      if (s.datetimeStarted) {
        const d = s.datetimeStarted.split("T")[0];
        if (!entry.lastSeen || d > entry.lastSeen) entry.lastSeen = d;
      }
    });

    return [...map.values()].sort((a, b) => a.total - b.total).slice(0, limit);
  }, [sessions, limit]);

  // Single call to get ALL parents, then build id → email map
  useEffect(() => {
    TutortoiseClient.getParentHistory()
      .then((parents: ParentRecord[]) => {
        const emailMap: Record<string, string> = {};
        parents.forEach((p) => {
          emailMap[String(p.id)] = p.email;
        });
        setParentEmails(emailMap);
      })
      .catch(() => {
        // silently fail — emails will show "—"
      });
  }, []); // ← runs once on mount, no dependency on rows

  const maxTotal = rows[rows.length - 1]?.total || 1;

  const formatDate = (d: string | null) => {
    if (!d) return "Never";
    const diff = Math.floor(
      (new Date().getTime() - new Date(d).getTime()) / 86400000,
    );
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff}d ago`;
    if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
    return `${Math.floor(diff / 30)}mo ago`;
  };

  return (
    <div className="las__root">
      <div className="las__header">
        <div>
          <h3 className="las__title">Least Active Students</h3>
          <p className="las__subtitle">
            Bottom {limit} by session count · excl. cancelled
          </p>
        </div>
        <span className="las__badge">{rows.length} students</span>
      </div>

      <div className="las__col-heads">
        <span className="las__col-rank">#</span>
        <span className="las__col-student">Student</span>
        <span className="las__col-parent">Parent Email</span>
        <span className="las__col-last">Last Active</span>
      </div>

      <ul className="las__list">
        {rows.map((s, i) => {
          return (
            <li key={s.studentId} className="las__row">
              <span className="las__rank">{i + 1}</span>

              <div className="las__student">
                <div>
                  <p className="las__name">{s.studentName}</p>
                  <p className="las__id">ID {s.studentId}</p>
                </div>
              </div>

              <span className="las__name">
                {s.parentId ? (parentEmails[s.parentId] ?? "Loading…") : "—"}
              </span>

              <span className="las__last">{formatDate(s.lastSeen)}</span>
            </li>
          );
        })}

        {rows.length === 0 && (
          <li className="las__empty">No session data available.</li>
        )}
      </ul>

      <div className="las__footer">
        <span className="las__legend-note">
          relative to group max ({rows[rows.length - 1]?.total ?? 0} sessions)
        </span>
      </div>
    </div>
  );
}
