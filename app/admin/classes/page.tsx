"use client";
import { useEffect, useState, useMemo } from "react";
import { TutortoiseClient } from "../../_api/tutortoiseClient";
import Databox from "../../_components/DataBox/Databox";
import TablePagination from "@mui/material/TablePagination";
import "../student/students.css";

interface Session {
  studentId: string;
  studentFirstName?: string;
  studentLastName?: string;
  tutorId?: string;
  tutorName?: string;
  subject?: string;
  sessionStatus: string;
  datetimeStarted?: string;
}

interface SubjectRow {
  subject: string;
  tutorId: string;
  tutorName: string;
  studentCount: number;
  studentIds: string[];
  totalSessions: number;
  completedSessions: number;
}

export default function ClassesPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [sortKey, setSortKey]   = useState<keyof SubjectRow>("studentCount");
  const [sortDir, setSortDir]   = useState<"asc" | "desc">("desc");
  const [page, setPage]         = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) =>
    setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    TutortoiseClient.getSessionHistory().then((data) => {
      if (Array.isArray(data)) setSessions(data);
      setLoading(false);
    });
  }, []);

  const rows = useMemo<SubjectRow[]>(() => {
    const map = new Map<string, SubjectRow>();

    sessions.forEach((s) => {
      if (!s.subject || !s.tutorId) return;
      const key = `${s.subject}__${s.tutorId}`;

      if (!map.has(key)) {
        map.set(key, {
          subject:           s.subject,
          tutorId:           s.tutorId,
          tutorName:         s.tutorName ?? `Tutor ${s.tutorId}`,
          studentCount:      0,
          studentIds:        [],
          totalSessions:     0,
          completedSessions: 0,
        });
      }

      const row = map.get(key)!;
      row.totalSessions += 1;

      const status = s.sessionStatus?.toLowerCase();
      if (status === "completed") row.completedSessions += 1;

      if (s.studentId && !row.studentIds.includes(s.studentId)) {
        row.studentIds.push(s.studentId);
        row.studentCount += 1;
      }
    });

    return [...map.values()];
  }, [sessions]);

  const stats = useMemo(() => ({
    totalSubjects: new Set(rows.map((r) => r.subject)).size,
    totalTutors:   new Set(rows.map((r) => r.tutorId)).size,
    totalMappings: rows.length,
    totalStudents: new Set(sessions.map((s) => s.studentId)).size,
  }), [rows, sessions]);

  const displayed = useMemo(() => {
    let list = [...rows];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.subject.toLowerCase().includes(q) ||
          r.tutorName.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [rows, search, sortKey, sortDir]);

  const paginated = useMemo(
    () => displayed.slice(page * rowsPerPage, (page + 1) * rowsPerPage),
    [displayed, page, rowsPerPage]
  );

  useEffect(() => { setPage(0); }, [search, sortKey, sortDir]);

  const handleSort = (k: keyof SubjectRow) => {
    if (k === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setSortDir("desc"); }
  };

  const sortIcon = (k: keyof SubjectRow) =>
    sortKey !== k ? "↕" : sortDir === "asc" ? "↑" : "↓";

  const completionRate = (r: SubjectRow) =>
    r.totalSessions > 0
      ? Math.round((r.completedSessions / r.totalSessions) * 100)
      : 0;

  const healthColor = (rate: number) => {
    if (rate >= 70) return "var(--Highlight)";
    if (rate >= 40) return "rgba(255,255,255,0.8)";
    return "#fca5a5";
  };

  return (
    <main className="dashboard">

      {/* ── Databoxes ── */}
      <section className="dashboard__data-row" style={{ margin: "20px 20px" }}>
        <Databox title="Total Subjects"      value={stats.totalSubjects} />
        <Databox title="Active Tutors"       value={stats.totalTutors} />
        <Databox title="Subject Mappings"    value={stats.totalMappings} />
        <Databox title="Total Students"      value={stats.totalStudents} />
      </section>

      {/* ── Table ── */}
      <div className="sp__table-card">

        {loading ? (
          <div className="sp__loading">
            <div className="sp__spinner" />
            Loading classes…
          </div>
        ) : (
          <div className="sp__table-wrap">
            <table className="sp__table">
              <thead>
                <tr>
                  <th>#</th>
                  <th className="sp__th-sort" onClick={() => handleSort("subject")}>
                    Subject {sortIcon("subject")}
                  </th>
                  <th className="sp__th-sort" onClick={() => handleSort("tutorName")}>
                    Tutor {sortIcon("tutorName")}
                  </th>
                  <th className="sp__th-sort" onClick={() => handleSort("studentCount")}>
                    Students {sortIcon("studentCount")}
                  </th>
                  <th className="sp__th-sort" onClick={() => handleSort("totalSessions")}>
                    Total Sessions {sortIcon("totalSessions")}
                  </th>
                  <th className="sp__th-sort" onClick={() => handleSort("completedSessions")}>
                    Completed {sortIcon("completedSessions")}
                  </th>
                  <th>Completion</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((r, i) => {
                  const rate  = completionRate(r);
                  const color = healthColor(rate);
                  const globalIndex = page * rowsPerPage + i + 1;

                  return (
                    <tr key={`${r.subject}-${r.tutorId}`} className="sp__row">

                      <td className="sp__td-rank">{globalIndex}</td>

                      {/* Subject */}
                      <td>
                          {r.subject}
                      </td>

                      {/* Tutor */}
                      <td>
                        <div className="sp__student-cell">
                          <div>
                            <p className="sp__name">{r.tutorName}</p>
                            <p className="sp__sid">ID · {r.tutorId}</p>
                          </div>
                        </div>
                      </td>

                      {/* Students */}
                      <td className="sp__td-num">{r.studentCount}</td>

                      {/* Sessions */}
                      <td className="sp__td-num">{r.totalSessions}</td>

                      {/* Completed */}
                      <td className="sp__td-completed">{r.completedSessions}</td>

                      {/* Completion bar */}
                      <td>
                        <div className="sp__health">
                          <div className="sp__health-bar">
                            <div
                              className="sp__health-fill"
                              style={{ width: `${rate}%`, background: color }}
                            />
                          </div>
                          <span className="sp__health-pct" style={{ color }}>
                            {rate}%
                          </span>
                        </div>
                      </td>

                    </tr>
                  );
                })}

                {displayed.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="sp__empty">
                      No classes found{search ? ` for "${search}"` : ""}.
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
    </main>
  );
}