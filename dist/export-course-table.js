(function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    }

    function uuidv4() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    var ICS = (function () {
        function ICS() {
            this.events = "";
        }
        ICS.toICSDateString = function (date) {
            return date.toISOString().replace(/[:-]/g, "").replace(/\.\d{3}/g, "");
        };
        ICS.prototype.addEvent = function (summary, description, location, dtstart, dtend) {
            var d = new Date();
            this.events += "BEGIN:VEVENT\n" +
                ("UID:" + uuidv4() + "@stormyyd.com\n") +
                ("DTSTAMP:" + ICS.toICSDateString(d) + "\n") +
                ("DTSTART:" + ICS.toICSDateString(dtstart) + "\n") +
                ("DTEND:" + ICS.toICSDateString(dtend) + "\n") +
                ("SUMMARY:" + summary + "\n") +
                ("DESCRIPTION:" + description + "\n") +
                ("LOCATION:" + location + "\n") +
                "TRANSP:OPAQUE\n" +
                "END:VEVENT\n";
        };
        ICS.prototype.getCalendar = function () {
            return "BEGIN:VCALENDAR\n" +
                "VERSION:2.0\n" +
                "PRODID:https://github.com/stormyyd\n" +
                this.events +
                "END:VCALENDAR";
        };
        return ICS;
    }());

    var School = (function () {
        function School() {
        }
        return School;
    }());

    var SHU = (function (_super) {
        __extends(SHU, _super);
        function SHU(FirstDay, Weeks) {
            var _this = _super.call(this) || this;
            var firstDay = FirstDay ? FirstDay : (function () {
                var dateStr;
                do {
                    dateStr = prompt("请按 2006-01-02 的格式输入第一天上课的日期");
                } while (!SHU.isValidDay(dateStr));
                var fday = new Date(dateStr);
                var day = fday.getDay();
                if (day !== 1) {
                    if (day === 0) {
                        fday.setDate(fday.getDate() - 6);
                    }
                    else {
                        fday.setDate(fday.getDate() - day + 1);
                    }
                }
                return fday.toISOString().split("T")[0];
            })();
            _this.firstDay = firstDay;
            var weeks = Weeks ? Weeks : SHU.semesterToWeeksMapping[document.querySelector(".span_currentUserInfo font").textContent.match(/[春夏秋冬]/)[0]];
            _this.weeks = weeks;
            return _this;
        }
        SHU.isValidDay = function (date) {
            if (date.split("-").length !== 3) {
                return false;
            }
            if (/[T:]/.test(date)) {
                return false;
            }
            return !isNaN(Date.parse(date));
        };
        SHU.combine = function (date, time) {
            return new Date(date.toISOString().split("T")[0] + "T" + time + "+0800");
        };
        SHU.getCourse = function () {
            var result = new Array();
            var courseTable = document.querySelector(".tbllist");
            var courseList = Array.from(courseTable.querySelectorAll("tr")).slice(3, -1);
            for (var _i = 0, courseList_1 = courseList; _i < courseList_1.length; _i++) {
                var course = courseList_1[_i];
                var allItem = Array.from(course.querySelectorAll("td"));
                result.push({
                    name: allItem[2].textContent.trim(),
                    teacher: allItem[4].textContent.trim(),
                    timeStr: allItem[6].textContent.trim(),
                    location: allItem[7].textContent.trim(),
                });
            }
            return result;
        };
        SHU.prototype.getICSData = function () {
            var c = new ICS();
            var courseList = SHU.getCourse();
            for (var _i = 0, courseList_2 = courseList; _i < courseList_2.length; _i++) {
                var course = courseList_2[_i];
                var timeList = this.getTime(course.timeStr);
                for (var _a = 0, timeList_1 = timeList; _a < timeList_1.length; _a++) {
                    var time = timeList_1[_a];
                    c.addEvent(course.name, "教师：" + course.teacher + "\\n" + course.timeStr, course.location, time.startTime, time.endTime);
                }
            }
            return c.getCalendar();
        };
        SHU.prototype.getTime = function (time) {
            var matchedResult;
            var timeList = new Array();
            while (matchedResult = SHU.pattern.exec(time)) {
                var mapping = {
                    weekday: SHU.weekdayMapping[matchedResult[1]],
                    startTime: SHU.startTimeMapping[parseInt(matchedResult[2], 10)],
                    endTime: SHU.endTimeMapping[parseInt(matchedResult[3], 10)],
                    single: matchedResult[4],
                    weekStart: parseInt(matchedResult[6], 10),
                    type: matchedResult[7],
                    weekEnd: parseInt(matchedResult[8], 10),
                    week: parseInt(matchedResult[9], 10),
                };
                var day = new Date(this.firstDay);
                day.setDate(day.getDate() + mapping.weekday);
                if (!isNaN(mapping.week)) {
                    day.setDate(day.getDate() + 7 * (mapping.week - 1));
                    timeList.push({
                        startTime: SHU.combine(day, mapping.startTime),
                        endTime: SHU.combine(day, mapping.endTime),
                    });
                }
                else if (mapping.type === ",") {
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
                }
                else if (mapping.type === "-") {
                    day.setDate(day.getDate() + 7 * (mapping.weekStart - 1));
                    for (var i = 0; i < mapping.weekEnd - mapping.weekStart + 1; i++) {
                        timeList.push({
                            startTime: SHU.combine(day, mapping.startTime),
                            endTime: SHU.combine(day, mapping.endTime),
                        });
                        day.setDate(day.getDate() + 7);
                    }
                }
                else if (["单", "双"].includes(mapping.single)) {
                    if (mapping.single === "双") {
                        day.setDate(day.getDate() + 7);
                    }
                    for (var i = 0; i < this.weeks / 2; i++) {
                        timeList.push({
                            startTime: SHU.combine(day, mapping.startTime),
                            endTime: SHU.combine(day, mapping.endTime),
                        });
                        day.setDate(day.getDate() + 14);
                    }
                }
                else {
                    for (var i = 0; i < this.weeks; i++) {
                        timeList.push({
                            startTime: SHU.combine(day, mapping.startTime),
                            endTime: SHU.combine(day, mapping.endTime),
                        });
                        day.setDate(day.getDate() + 7);
                    }
                }
            }
            return timeList;
        };
        SHU.hostname = [
            "xk.autoisp.shu.edu.cn",
        ];
        SHU.semesterToWeeksMapping = {
            春: 10,
            夏: 4,
            秋: 10,
            冬: 10,
        };
        SHU.startTimeMapping = {
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
        SHU.endTimeMapping = {
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
        SHU.weekdayMapping = {
            一: 0,
            二: 1,
            三: 2,
            四: 3,
            五: 4,
        };
        SHU.pattern = new RegExp(String.raw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["([\u4E00\u4E8C\u4E09\u56DB\u4E94])(d{1,2})-(d{1,2})([\u5355\u53CCs])?"], ["([\u4E00\u4E8C\u4E09\u56DB\u4E94])(\\d{1,2})-(\\d{1,2})([\u5355\u53CC\\s])?"]))) + String.raw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["(s?((d{1,2})([,-])(d{1,2})\u5468.*s?)|(\u7B2C(d)\u5468))?"], ["(\\s?\\((\\d{1,2})([,-])(\\d{1,2})\u5468.*\\s?\\)|\\(\u7B2C(\\d)\u5468\\))?"]))), "g");
        return SHU;
    }(School));
    var templateObject_1, templateObject_2;



    var schools = /*#__PURE__*/Object.freeze({
        SHU: SHU
    });

    function saveFile(fileURL, filename) {
        var element = document.createElement("a");
        element.href = fileURL;
        element.download = filename;
        element.style.display = "none";
        document.getElementsByTagName("body")[0].appendChild(element);
        element.click();
        element.remove();
    }
    function main() {
        for (var i in schools) {
            var school = schools[i];
            if (school.hostname.includes(location.hostname)) {
                var s = new school();
                var icsData = s.getICSData();
                var icsBlob = new Blob([icsData], { type: "text/plain" });
                var icsURL = URL.createObjectURL(icsBlob);
                saveFile(icsURL, "courses.ics");
                URL.revokeObjectURL(icsURL);
                return;
            }
        }
        alert("暂不支持");
    }
    main();

}());
