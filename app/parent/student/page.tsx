"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import {
  CheckCircleOutline,
  EmojiEvents,
  History,
  ShowChart,
  TrendingDown,
  TrendingFlat,
  TrendingUp,
} from "@mui/icons-material";

import { ParentContext } from "../../context/ParentContext";
import { TutortoiseClient } from "../../_api/tutortoiseClient";
import DataTable from "../../_components/DataTable/Student/DataTable";
import "./student.css";

// ─── Types ───────────────────────────────────────────────────────────────────

type Session = {
  sessionId: string;
  parentId: number;
  studentId: number;
  tutorId: number;
  tutorName: string;
  sessionStatus: string;
  datetimeStarted: string;
  durationsHours: number;
  assessmentPointsEarned: number;
  assessmentPointsGoal: number;
  assessmentPointsMax: number;
  studentFirstName: string;
  studentLastName: string;
  subject: string;
  notes?: string;
};

type SubjectProgress = {
  subjectName: string;
  hoursUsed: number;
  scorePercent: number;
};

const toPercent = (earned: number, max: number) =>
  max > 0 ? Math.round((earned / max) * 100) : 0;

// ─── SubjectChart: line chart for one subject ─────────────────────────────────

function SubjectChart({
  subject,
  sessions,
}: {
  subject: string;
  sessions: Session[];
}) {
  // Convert each session's points to a percentage score
  const points = sessions.map((s) =>
    toPercent(s.assessmentPointsEarned, s.assessmentPointsMax),
  );
  const W = 460,
    H = 160,
    PAD = 28;
  const minY = Math.max(0, Math.min(...points) - 10);
  const maxY = Math.min(100, Math.max(...points) + 10);
  const xScale = (i: number) =>
    PAD + (i / Math.max(points.length - 1, 1)) * (W - PAD * 2);
  const yScale = (v: number) =>
    H - PAD - ((v - minY) / (maxY - minY)) * (H - PAD * 2);

  const polyline = points.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" ");
  const fillPath =
    `M${xScale(0)},${yScale(points[0])} ` +
    points.map((v, i) => `L${xScale(i)},${yScale(v)}`).join(" ") +
    ` L${xScale(points.length - 1)},${H - PAD} L${xScale(0)},${H - PAD} Z`;

  const latest = points[points.length - 1];
  const delta = points.length >= 2 ? latest - points[points.length - 2] : 0;

  const TrendIcon =
    delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : TrendingFlat;
  const trendClass =
    delta > 0
      ? "sc-trend--up"
      : delta < 0
        ? "sc-trend--down"
        : "sc-trend--flat";

  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2 }}>
      <Stack spacing={1.5}>
        {/* Subject name + trend chip */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="subtitle2" fontWeight={600}>
            {subject}
          </Typography>
          {points.length >= 2 && (
            <Chip
              size="small"
              icon={<TrendIcon fontSize="small" />}
              label={`${delta > 0 ? "+" : ""}${delta}pts vs last`}
              className={`sc-trend-chip ${trendClass}`}
            />
          )}
        </Stack>

        {/* SVG line chart */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="sc-svg"
          aria-label={`${subject} score trend`}
        >
          {/* Horizontal grid lines at 0, 25, 50, 75, 100 */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const y = yScale(Math.max(minY, Math.min(maxY, tick)));
            return (
              <g key={tick}>
                <line
                  x1={PAD}
                  x2={W - PAD}
                  y1={y}
                  y2={y}
                  className="sc-grid-line"
                />
                <text x={6} y={y + 4} className="sc-axis-label">
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Filled area, line, dots, latest score label */}
          <path d={fillPath} className="sc-area" />
          <polyline
            points={polyline}
            fill="none"
            className="sc-line"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {points.map((v, i) => (
            <circle
              key={i}
              cx={xScale(i)}
              cy={yScale(v)}
              r={4}
              className="sc-dot"
            >
              <title>
                Session {i + 1}: {v}%
              </title>
            </circle>
          ))}
          <text
            x={xScale(points.length - 1)}
            y={yScale(latest) - 10}
            textAnchor="middle"
            className="sc-value-label"
          >
            {latest}%
          </text>
        </svg>

        {/* X-axis: session dates */}
        <Box className="sc-x-axis">
          {sessions.map((s, i) => (
            <Typography key={i} variant="caption" color="text.disabled">
              {new Date(s.datetimeStarted).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Typography>
          ))}
        </Box>
      </Stack>
    </Paper>
  );
}
// ─── Score Growth SVG Chart ───────────────────────────────────────────────────

function ScoreChart({ sessions }: { sessions: Session[] }) {
  // Group completed+graded sessions by subject
  const bySubject = useMemo(() => {
    const valid = [...sessions]
      .filter(
        (s) => s.sessionStatus === "completed" && s.assessmentPointsMax > 0,
      )
      .sort(
        (a, b) =>
          new Date(a.datetimeStarted).getTime() -
          new Date(b.datetimeStarted).getTime(),
      );

    return valid.reduce(
      (acc, s) => {
        const subj = s.subject || "Unknown";
        if (!acc[subj]) acc[subj] = [];
        acc[subj].push(s);
        return acc;
      },
      {} as Record<string, Session[]>,
    );
  }, [sessions]);

  const subjects = Object.keys(bySubject);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  useEffect(() => {
    if (subjects.length > 0 && !selectedSubject) {
      setSelectedSubject(subjects[0]);
    }
  }, [subjects]);

  if (subjects.length === 0) {
    return (
      <Box className="sc-empty">
        <ShowChart className="sc-empty__icon" />
        <Typography variant="body2" color="text.disabled">
          Complete at least 1 graded session to see score trends.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="overline" color="text.secondary">
          Score Trend
        </Typography>
        <Select
          size="small"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          {subjects.map((subj) => (
            <MenuItem key={subj} value={subj}>
              {subj}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      {selectedSubject && bySubject[selectedSubject] && (
        <SubjectChart
          subject={selectedSubject}
          sessions={bySubject[selectedSubject]}
        />
      )}
    </Stack>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon,
  variant = "default",
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  variant?: "default" | "accent";
}) {
  return (
    <Card className={`stat-card stat-card--${variant}`}>
      <CardContent>
        <Stack direction="row" alignItems="flex-start" spacing={2}>
          <Avatar className={`stat-card__avatar stat-card__avatar--${variant}`}>
            {icon}
          </Avatar>
          <Box>
            <Typography variant="overline" className="stat-card__label">
              {label}
            </Typography>
            <Typography variant="h5" className="stat-card__value">
              {value ?? "—"}
            </Typography>
            {sub && (
              <Typography variant="caption" color="text.disabled">
                {sub}
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

// ─── Subject Progress Row ─────────────────────────────────────────────────────

function SubjectRow({ sub }: { sub: SubjectProgress }) {
  const pct = Math.min(100, Math.max(0, sub.scorePercent)); // to get the average score percent, not removing incase we want to fallback to this option later if we want to show progress based on score instead of hours
  const colorClass = "sp-bar--high";
  const sessionsAmount = Math.floor(sub.hoursUsed * 10);
  return (
    <TableRow>
      <TableCell>
        <Typography variant="body2" fontWeight={600}>
          {sub.subjectName}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {sub.hoursUsed.toFixed(0)}
        </Typography>
      </TableCell>
      <TableCell sx={{ minWidth: 160 }}>
        <LinearProgress
          variant="determinate"
          value={sessionsAmount}
          className={`sp-bar ${colorClass}`}
        />
      </TableCell>
      <TableCell>
        <Chip
          size="small"
          label={`${sessionsAmount}%`}
          className={`sp-pct-chip ${colorClass}`}
        />
      </TableCell>
    </TableRow>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StudentPage() {
  const parentCtx = useContext(ParentContext);
  if (!parentCtx)
    throw new Error(
      "ParentContext is missing. Wrap the app in ParentProvider.",
    );

  const { students, selectedStudent } = parentCtx.parentDetails;
  const { setParentDetails } = parentCtx;

  const [loading, setLoading] = useState(true);
  const [studentSessions, setStudentSessions] = useState<Session[]>([]);
  const [completedSessions, setCompletedSessions] = useState<Session[]>([]);
  const [subjectProgress, setSubjectProgress] = useState<SubjectProgress[]>([]);
  const [latestScore, setLatestScore] = useState<number | null>(null);
  const [previousScore, setPreviousScore] = useState<number | null>(null);

  // ── Auto-select first student if none is selected yet ─────────────────────
  useEffect(() => {
    if (!selectedStudent && students?.length > 0) {
      setParentDetails((prev) => ({ ...prev, selectedStudent: students[0] }));
    }
  }, [students, selectedStudent, setParentDetails]);

  // ── Handle dropdown change ─────────────────────────────────────────────────
  const handleStudentChange = (e: SelectChangeEvent<number>) => {
    const chosen = students.find((s) => s.studentId === Number(e.target.value));
    if (chosen) {
      setParentDetails((prev) => ({ ...prev, selectedStudent: chosen }));
    }
  };

  // ── Fetch sessions whenever selected student changes ───────────────────────
  useEffect(() => {
    if (!selectedStudent?.studentId) return;
    setLoading(true);

    // Clear stale scores immediately so they don't flash when switching students
    setLatestScore(null);
    setPreviousScore(null);

    TutortoiseClient.getAllSessions()
      .catch(() => [])
      .then((sessionsData: any) => {
        const all: Session[] = Array.isArray(sessionsData)
          ? sessionsData
          : (sessionsData?.sessions ?? []);

        const mine = all.filter(
          (s) => s.studentId === selectedStudent.studentId,
        );
        const completed = mine.filter((s) => s.sessionStatus === "completed");

        const sorted = [...completed].sort(
          (a, b) =>
            new Date(a.datetimeStarted).getTime() -
            new Date(b.datetimeStarted).getTime(),
        );
        const scored = sorted.filter((s) => s.assessmentPointsMax > 0);

        if (scored.length >= 2) {
          const last = scored[scored.length - 1];
          const prev = scored[scored.length - 2];
          setLatestScore(
            Math.round(
              (last.assessmentPointsEarned / last.assessmentPointsMax) * 100,
            ),
          );
          setPreviousScore(
            Math.round(
              (prev.assessmentPointsEarned / prev.assessmentPointsMax) * 100,
            ),
          );
        } else if (scored.length === 1) {
          setLatestScore(
            Math.round(
              (scored[0].assessmentPointsEarned /
                scored[0].assessmentPointsMax) *
                100,
            ),
          );
        }

        const subjectMap: Record<
          string,
          { hoursUsed: number; earned: number; max: number }
        > = {};
        completed.forEach((s) => {
          if (!subjectMap[s.subject])
            subjectMap[s.subject] = { hoursUsed: 0, earned: 0, max: 0 };
          subjectMap[s.subject].hoursUsed += s.durationsHours ?? 0;
          subjectMap[s.subject].earned += s.assessmentPointsEarned ?? 0;
          subjectMap[s.subject].max += s.assessmentPointsMax ?? 0;
        });

        setSubjectProgress(
          Object.entries(subjectMap).map(([name, d]) => ({
            subjectName: name,
            hoursUsed: d.hoursUsed,
            scorePercent: d.max > 0 ? (d.earned / d.max) * 100 : 0,
          })),
        );
        setStudentSessions(mine);
        setCompletedSessions(completed);
        setLoading(false);
      });
  }, [selectedStudent?.studentId]);

  const firstName = selectedStudent?.studentName?.split(" ")[0] ?? "Student";

  return (
    <Box className="student-page">
      {/* ── Header ── */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        className="sp-header"
      >
        <Avatar className="sp-header__avatar">
          {firstName.charAt(0).toUpperCase()}
        </Avatar>

        <Box flex={1}>
          <Typography variant="h5" className="sp-header__name">
            {selectedStudent?.studentName ?? "—"}
          </Typography>
          <Chip
            size="small"
            label="Academic Profile"
            className="sp-header__chip"
          />
        </Box>

        {/* ── Student switcher — only rendered when parent has > 1 student ── */}
        {students?.length > 1 && (
          <Select
            size="small"
            value={selectedStudent?.studentId ?? ""}
            onChange={handleStudentChange}
            displayEmpty
            sx={{ minWidth: 180 }}
          >
            {students.map((s) => (
              <MenuItem key={s.studentId} value={s.studentId}>
                {s.studentName}
              </MenuItem>
            ))}
          </Select>
        )}
      </Stack>

      {loading ? (
        <Box className="sp-loading">
          <CircularProgress color="success" />
          <Typography variant="body2" color="text.disabled">
            Loading academic data…
          </Typography>
        </Box>
      ) : (
        <Stack spacing={4}>
          {/* ── Stat Cards ── */}
          <Box className="sp-stats-grid">
            <StatCard
              label="Sessions Completed"
              value={completedSessions.length}
              sub="graded sessions"
              icon={<CheckCircleOutline />}
            />
            <StatCard
              label="Latest Score"
              value={latestScore !== null ? `${latestScore}%` : "—"}
              sub="most recent graded session"
              icon={<EmojiEvents />}
              variant="accent"
            />
            <StatCard
              label="Previous Score"
              value={previousScore !== null ? `${previousScore}%` : "—"}
              sub="second most recent session"
              icon={<History />}
            />
            <StatCard
              label="Total Sessions"
              value={studentSessions.length}
              sub="including upcoming"
              icon={<ShowChart />}
            />
          </Box>

          {/* ── Score Growth Chart ── */}
          <Box>
            <Typography variant="h6" className="sp-section-title">
              Academic Growth Chart
            </Typography>
            <Card>
              <CardContent>
                <ScoreChart sessions={completedSessions} />
              </CardContent>
            </Card>
          </Box>

          {/* ── Subject Progress ── */}
          <Box>
            <Typography variant="h6" className="sp-section-title">
              Subject Progress
            </Typography>
            <Card>
              {subjectProgress.length === 0 ? (
                <CardContent>
                  <Typography
                    variant="body2"
                    color="text.disabled"
                    textAlign="center"
                    py={3}
                  >
                    No subject data yet — complete graded sessions to see
                    progress.
                  </Typography>
                </CardContent>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Subject</TableCell>
                        <TableCell>Sessions</TableCell>
                        <TableCell>Progress</TableCell>
                        <TableCell>Completion %</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {subjectProgress.map((sub, i) => (
                        <SubjectRow key={i} sub={sub} />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Card>
          </Box>

          {/* ── Session History ── */}
          <Box>
            <Typography variant="h6" className="sp-section-title">
              Session History
            </Typography>
            <Divider className="sp-divider" />
            {completedSessions.length === 0 ? (
              <Card>
                <CardContent>
                  <Typography
                    variant="body2"
                    color="text.disabled"
                    textAlign="center"
                    py={3}
                  >
                    No completed sessions found for this student.
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <DataTable sessions={completedSessions as any} type="completed" />
            )}
          </Box>
        </Stack>
      )}
    </Box>
  );
}
