"use client";
import { useEffect, useState, useMemo } from "react";
import { TutortoiseClient } from "../../_api/tutortoiseClient";
import LeastActiveStudents from "../../_components/DataBox/LeastActiveStudents";
import Databox from "../../_components/DataBox/Databox";
import "./students.css";
import TablePagination from "@mui/material/TablePagination";

interface Session {
  studentId: string;
  studentFirstName?: string;
  studentLastName?: string;
  sessionStatus: string;
  datetimeStarted?: string;
  tutorId?: string;
  subject?: string;
  parentId: string | null;
}

interface StudentProfile {
  studentId: string;
  studentName: string;
  total: number;
  completed: number;
  scheduled: number;
  cancelled: number;
  lastSeen: string | null;
  subjects: string[];
  tutors: string[];
  creditsRemaining: number;
}

export default function StudentPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof StudentProfile>("total");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [activeView, setActiveView] = useState<"all" | "least">("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => setPage(newPage);
  const handleChangeRowsPerPage = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    TutortoiseClient.getSessionHistory().then((data) => {
      if (Array.isArray(data)) setSessions(data);
      setLoading(false);
    });
  }, []);

  const profiles = useMemo<StudentProfile[]>(() => {
    const map = new Map<string, StudentProfile>();
    sessions.forEach((s) => {
      if (!map.has(s.studentId)) {
        map.set(s.studentId, {
          studentId: s.studentId,
          studentName: s.studentFirstName + " " + s.studentLastName,
          total: 0,
          completed: 0,
          scheduled: 0,
          cancelled: 0,
          lastSeen: null,
          subjects: [],
          tutors: [],
          creditsRemaining: 0,
        });
      }
      const p = map.get(s.studentId)!;
      p.total += 1;
      const status = s.sessionStatus?.toLowerCase();
      if (status === "open") {
        p.creditsRemaining += 1;
      }
      if (status === "completed") p.completed += 1;
      if (status === "scheduled") p.scheduled += 1;
      if (status === "cancelled") p.cancelled += 1;
      if (s.datetimeStarted) {
        const d = s.datetimeStarted.split("T")[0];
        if (!p.lastSeen || d > p.lastSeen) p.lastSeen = d;
      }
      if (s.subject && !p.subjects.includes(s.subject))
        p.subjects.push(s.subject);
      if (s.tutorId && !p.tutors.includes(s.tutorId)) p.tutors.push(s.tutorId);
    });
    return [...map.values()];
  }, [sessions]);

  const stats = useMemo(() => {
    const totalSessions = profiles.reduce((sum: number, p) => sum + p.total, 0);
    return {
      total: profiles.length,
      active: profiles.filter((p) => p.completed > 0).length,
      avgSessions: profiles.length
        ? (totalSessions / profiles.length).toFixed(1)
        : "0",
      noShows: profiles.filter((p) => p.total > 0 && p.total === p.cancelled)
        .length,
    };
  }, [profiles]);

  const displayed = useMemo(() => {
    let list = [...profiles];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.studentName.toLowerCase().includes(q) || p.studentId.includes(q),
      );
    }

    list.sort((a, b) => {
      const av = a[sortKey],
        bv = b[sortKey];
      if (av === null) return 1;
      if (bv === null) return -1;
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [profiles, search, sortKey, sortDir]);

  const paginated = useMemo(
    () => displayed.slice(page * rowsPerPage, (page + 1) * rowsPerPage),
    [displayed, page, rowsPerPage],
  );

  const handleSort = (k: keyof StudentProfile) => {
    if (k === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setSortDir("desc");
    }
  };

  const sortIcon = (k: keyof StudentProfile) =>
    sortKey !== k ? "↕" : sortDir === "asc" ? "↑" : "↓";

  return (
    <main className="dashboard">
      <section className="dashboard__data-row" style={{ margin: "20px 20px" }}>
        <Databox title="Total Students" value={stats.total} />
        <Databox
          title="Active Students"
          subtitle="Completed ≥ 1 session"
          value={stats.active}
        />
        <Databox
          title="Avg Sessions"
          subtitle="Per student"
          value={stats.avgSessions}
        />
        <Databox
          title="No-show Only"
          subtitle="All sessions cancelled"
          value={stats.noShows}
        />
      </section>
      <div className="sp__view-toggle">
        <button
          className={`sp__toggle-btn ${activeView === "all" ? "sp__toggle-btn--on" : ""}`}
          onClick={() => setActiveView("all")}
        >
          All Students
        </button>
        <button
          className={`sp__toggle-btn ${activeView === "least" ? "sp__toggle-btn--on" : ""}`}
          onClick={() => setActiveView("least")}
        >
          Least Active
        </button>
      </div>

      {activeView === "least" && (
        <div style={{ margin: "0 20px" }}>
          <LeastActiveStudents sessions={sessions} limit={10} />
        </div>
      )}

      {activeView === "all" && (
        <div className="sp__table-card">
          {loading ? (
            <div className="sp__loading">
              <div className="sp__spinner" />
              Loading students…
            </div>
          ) : (
            <div className="sp__table-wrap">
              <table className="sp__table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th
                      className="sp__th-sort"
                      onClick={() => handleSort("studentName")}
                    >
                      Student {sortIcon("studentName")}
                    </th>
                    <th
                      className="sp__th-sort"
                      onClick={() => handleSort("total")}
                    >
                      Total {sortIcon("total")}
                    </th>
                    <th
                      className="sp__th-sort"
                      onClick={() => handleSort("scheduled")}
                    >
                      Upcoming {sortIcon("scheduled")}
                    </th>
                    <th
                      className="sp__th-sort"
                      onClick={() => handleSort("cancelled")}
                    >
                      Cancelled {sortIcon("cancelled")}
                    </th>
                    <th>Subjects</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((p, i) => {
                    const globalIndex = page * rowsPerPage + i + 1;
                    return (
                      <tr key={p.studentId} className="sp__row">
                        <td className="sp__td-rank">{globalIndex}</td>

                        <td>
                          <div className="sp__student-cell">
                            <div>
                              <p className="sp__name">{p.studentName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="sp__td-completed">{p.completed}</td>
                        <td className="sp__td-upcoming">{p.scheduled}</td>
                        <td className="sp__td-cancelled">{p.cancelled}</td>

                        <td>
                          <div className="sp__tags">
                            {p.subjects.slice(0, 2).map((sub) => (
                              <span key={sub} className="sp__tag">
                                {sub}
                              </span>
                            ))}
                            {p.subjects.length > 2 && (
                              <span className="sp__tag sp__tag--more">
                                +{p.subjects.length - 2}
                              </span>
                            )}
                            {p.subjects.length === 0 && (
                              <span className="sp__tag sp__tag--none">—</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {displayed.length === 0 && !loading && (
                    <tr>
                      <td colSpan={10} className="sp__empty">
                        No students found{search ? ` for "${search}"` : ""}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={displayed.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          )}
        </div>
      )}
    </main>
  );
}
