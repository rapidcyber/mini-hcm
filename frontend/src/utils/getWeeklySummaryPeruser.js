import React from "react";
import { DateTime, Interval } from "luxon";
import { getDailySummaryPerUser } from "./getDailySummaryPerUser";
export const getWeeklySummaryPerUser = (user, attendance) => {
  const dailySummary = getDailySummaryPerUser(user, attendance);

  const groupedByWeek = dailySummary.reduce((acc, entry) => {
    const weekStart = DateTime.fromISO(entry.date)
      .startOf("week")
      .toFormat("yyyy-MM-dd");
    if (!acc[weekStart]) acc[weekStart] = [];
    acc[weekStart].push(entry);
    return acc;
  }, {});

  console.log(groupedByWeek);

  return Object.entries(groupedByWeek).map(([weekStart, days]) => {
    const totals = days.reduce(
      (sum, day) => {
        const worked = day.workedHours;
        const late = day.late;
        const undertime = day.undertime;
        const overtime = day.overtime;
        const night = day.nightDifferential;

        return {
          worked: sum.worked + worked,
          late: sum.late + late,
          undertime: sum.undertime + undertime,
          overtime: sum.overtime + overtime,
          nightDiff: sum.nightDiff + night,
        };
      },
      { worked: 0, late: 0, undertime: 0, overtime: 0, nightDiff: 0 }
    );

    // console.log(totals);

    return {
      userId: user.id,
      weekStart,
      workedHours: totals.worked,
      late: totals.late,
      undertime: totals.undertime,
      overtime: totals.overtime,
      nightDifferential: totals.nightDiff,
    };
  });
};

export default getWeeklySummaryPerUser;
