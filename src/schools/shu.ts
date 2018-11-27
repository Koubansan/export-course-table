/*
 *  This file is part of export-course-table.
 *
 *  export-course-table is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  export-course-table is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.

 *  You should have received a copy of the GNU General Public License
 *  along with export-course-table.  If not, see <https://www.gnu.org/licenses/>.
 */

import ICS from "../ics";
import School from "./school";

interface Course {
    name: string;
    teacher: string;
    timeStr: string;
    location: string;
}

interface CourseTime {
    startTime: Date;
    endTime: Date;
}

class SHU extends School {
    public static readonly hostname = [
        "xk.autoisp.shu.edu.cn",
    ];
    private static readonly semesterToWeeksMapping = {
        春: 10,
        夏: 4,
        秋: 10,
        冬: 10,
    };
    private static readonly startTimeMapping = {
        1: "08:00",
        2: "08:55",
        3: "10:00",
        4: "10:55",
        5: "12:10",
        6: "13:05",
        7: "14:10",
        8: "15:05",
        9: "16:00",
        10: "16:55",
        11: "18:00",
        12: "18:55",
        13: "19:50",
    };
    private static readonly endTimeMapping = {
        1: "08:45",
        2: "09:40",
        3: "10:45",
        4: "11:40",
        5: "12:55",
        6: "13:50",
        7: "14:55",
        8: "15:50",
        9: "16:45",
        10: "17:40",
        11: "18:45",
        12: "19:40",
        13: "20:35",
    };
    private static readonly weekdayMapping = {
        一: 0,
        二: 1,
        三: 2,
        四: 3,
        五: 4,
    };
    private static readonly pattern = new RegExp(String.raw`([一二三四五])(\d{1,2})-(\d{1,2})([单双\s])?` +
                                                 String.raw`(\s?\((\d{1,2})([,-])(\d{1,2})周.*\s?\)|\(第(\d)周\))?`, "g");
    private static isValidDay(date: string): boolean {
        if (date.split("-").length !== 3) {
            return false;
        }
        if (/[T:]/.test(date)) {
            return false;
        }
        return !isNaN(Date.parse(date));
    }
    private static combine(date: Date, time: string): Date {
        return new Date(date.toISOString().split("T")[0] + "T" + time + "+0800");
    }
    private static getCourse(): Course[] {
        let result = new Array();
        let courseTable = document.querySelector(".tbllist");
        let courseList = Array.from(courseTable.querySelectorAll("tr")).slice(3, -1);
        for (let course of courseList) {
            let allItem = Array.from(course.querySelectorAll("td"));
            result.push({
                name: allItem[2].textContent.trim(),
                teacher: allItem[4].textContent.trim(),
                timeStr: allItem[6].textContent.trim(),
                location: allItem[7].textContent.trim(),
            });
        }
        return result;
    }
    private firstDay: string;
    private weeks: number;
    constructor(FirstDay?: string, Weeks?: number) {
        super();
        let firstDay = FirstDay ? FirstDay : (() => {
            let dateStr: string;
            do {
                dateStr = prompt("请按 2006-01-02 的格式输入第一天上课的日期");
            } while (!SHU.isValidDay(dateStr));
            let fday = new Date(dateStr);
            let day = fday.getDay();
            if (day !== 1) {
                if (day === 0) {
                    // Sunday
                    fday.setDate(fday.getDate() - 6);
                } else {
                    // except Monday and Sunday
                    fday.setDate(fday.getDate() - day + 1);
                }
            }
            return fday.toISOString().split("T")[0];
        })();
        this.firstDay = firstDay;
        let weeks = Weeks ? Weeks : SHU.semesterToWeeksMapping[
            document.querySelector(".span_currentUserInfo font").textContent.match(/[春夏秋冬]/)[0]
        ];
        this.weeks = weeks;
    }
    public getICSData(): string {
        let c = new ICS();
        let courseList = SHU.getCourse();
        for (let course of courseList) {
            let timeList = this.getTime(course.timeStr);
            for (let time of timeList) {
                c.addEvent(
                    course.name,
                    "教师：" + course.teacher + "\\n" + course.timeStr,
                    course.location,
                    time.startTime,
                    time.endTime,
                );
            }
        }
        return c.getCalendar();
    }
    private getTime(time: string): CourseTime[] {
        let matchedResult: string[];
        let timeList = new Array();
        while (matchedResult = SHU.pattern.exec(time)) {
            let mapping = {
                weekday: SHU.weekdayMapping[matchedResult[1]],
                startTime: SHU.startTimeMapping[parseInt(matchedResult[2], 10)],
                endTime: SHU.endTimeMapping[parseInt(matchedResult[3], 10)],
                single: matchedResult[4],
                weekStart: parseInt(matchedResult[6], 10),
                type: matchedResult[7],
                weekEnd: parseInt(matchedResult[8], 10),
                week: parseInt(matchedResult[9], 10),
            };
            let day = new Date(this.firstDay);
            day.setDate(day.getDate() + mapping.weekday);
            if (!isNaN(mapping.week)) {
                day.setDate(day.getDate() + 7 * (mapping.week - 1));
                timeList.push({
                    startTime: SHU.combine(day, mapping.startTime),
                    endTime: SHU.combine(day, mapping.endTime),
                });
            } else if (mapping.type === ",") {
                day.setDate(day.getDate() + 7 * (mapping.weekStart - 1));
                timeList.push({
                    startTime: SHU.combine(day, mapping.startTime),
                    endTime: SHU.combine(day, mapping.endTime),
                });
                day.setDate(day.getDate() + 7 * (mapping.weekEnd - mapping.weekStart));
                timeList.push({
                    startTime: SHU.combine(day, mapping.startTime),
                    endTime: SHU.combine(day, mapping.endTime),
                });
            } else if (mapping.type === "-") {
                day.setDate(day.getDate() + 7 * (mapping.weekStart - 1));
                for (let i = 0; i < mapping.weekEnd - mapping.weekStart + 1; i++) {
                    timeList.push({
                        startTime: SHU.combine(day, mapping.startTime),
                        endTime: SHU.combine(day, mapping.endTime),
                    });
                    day.setDate(day.getDate() + 7);
                }
            } else if (["单", "双"].includes(mapping.single)) {
                if (mapping.single === "双") {
                    day.setDate(day.getDate() + 7);
                }
                for (let i = 0; i < this.weeks / 2; i++) {
                    timeList.push({
                        startTime: SHU.combine(day, mapping.startTime),
                        endTime: SHU.combine(day, mapping.endTime),
                    });
                    day.setDate(day.getDate() + 14);
                }
            } else {
                for (let i = 0; i < this.weeks; i++) {
                    timeList.push({
                        startTime: SHU.combine(day, mapping.startTime),
                        endTime: SHU.combine(day, mapping.endTime),
                    });
                    day.setDate(day.getDate() + 7);
                }
            }
        }
        return timeList;
    }
}

export default SHU;
