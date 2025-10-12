import React from "react";
import { DateTime, Interval } from "luxon";

export const getDailySummaryPerUser = (user, attendance) => {
  const userAttendance = attendance?.data.data.filter(
    (attendance) => attendance.userId === user.id
  );

  // Step 1: Sort by timestamp
  const sorted = userAttendance
    ? userAttendance?.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      )
    : [];

  // Step 2: Pair in/out sessions
  const pairedSessions = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].type === "in" && sorted[i + 1].type === "out") {
      pairedSessions.push({
        in: DateTime.fromISO(sorted[i].timestamp),
        out: DateTime.fromISO(sorted[i + 1].timestamp),
      });
      i++; // skip next since it's already paired
    }
  }

  let summary = [];

  if (user) {
    const grouped = [];
    const sessions = pairedSessions.map((session) => {
      const date = session.in.toFormat("yyyy-MM-dd");
      const shiftStart = DateTime.fromFormat(
        `${date} ${user.schedule.start}`,
        "yyyy-MM-dd HH:mm",
        { zone: "Asia/Manila" }
      );
      return {
        date: shiftStart.toJSDate(),
        in: session.in,
        out: session.out,
      };
    });

    sessions.forEach((entry) => {
      const dateKey = DateTime.fromISO(entry.in).toFormat("yyyy-MM-dd");
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(entry);
    });

    summary = Object.entries(grouped).map(([date, entries]) => {
      const totalDuration = entries.reduce((total, entry) => {
        const duration = entry.out
          .diff(entry.in, ["hours", "minutes", "seconds"])
          .toObject();
        // return duration;
        return total + duration.hours * 60 + duration.minutes;
      }, 0);

      const shiftStart = DateTime.fromFormat(
        `${date} ${user.schedule.start}`,
        "yyyy-MM-dd HH:mm",
        { zone: "Asia/Manila" }
      );
      let shiftEnd = DateTime.fromFormat(
        `${date} ${user.schedule.end}`,
        "yyyy-MM-dd HH:mm",
        { zone: "Asia/Manila" }
      );
      if (shiftEnd < shiftStart) {
        shiftEnd = shiftEnd.plus({ days: 1 });
      }
      const firstIn = entries[0].in;
      const lastOut = entries[entries.length - 1].out;
      const Hourslate = firstIn
        .diff(shiftStart, ["hours", "minutes", "seconds"])
        .toObject();
      const Undertime = shiftEnd
        .diff(lastOut, ["hours", "minutes", "seconds"])
        .toObject();
      const OverTime = lastOut
        .diff(shiftEnd, ["hours", "minutes", "seconds"])
        .toObject();
      const nightStart = shiftStart.set({ hour: 22, minute: 0 });
      const nightEnd = shiftStart.plus({ days: 1 }).set({ hour: 6, minute: 0 });

      //compute night differencial
      const nightDuration = entries.reduce((total, entry) => {
        const overlap = Interval.fromDateTimes(
          entry.in,
          entry.out
        ).intersection(Interval.fromDateTimes(nightStart, nightEnd));
        if (overlap) {
          return total + overlap.length("minutes");
        }
        return total;
      }, 0);

      return {
        date,
        workedHours: Math.max(0, totalDuration),
        undertime: Math.max(0, Undertime.hours * 60 + Undertime.minutes),
        late: Math.max(0, Hourslate.hours * 60 + Hourslate.minutes),
        overtime: Math.max(0, OverTime.hours * 60 + OverTime.minutes),
        nightDifferential: Math.max(0, nightDuration),
      };
    });
  }

  return summary;
};

export default getDailySummaryPerUser;