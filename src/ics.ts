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

import uuidv4 from "./uuidv4";

class ICS {
    private static toICSDateString(date: Date): string {
        return date.toISOString().replace(/[:-]/g, "").replace(/\.\d{3}/g, "");
    }
    private events: string;
    constructor() {
        this.events = "";
    }
    public addEvent(summary: string, description: string, location: string, dtstart: Date, dtend: Date): void {
        let d = new Date();
        this.events += "BEGIN:VEVENT\n"                               +
                       `UID:${uuidv4()}@stormyyd.com\n`               +
                       `DTSTAMP:${ICS.toICSDateString(d)}\n`          +
                       `DTSTART:${ICS.toICSDateString(dtstart)}\n`    +
                       `DTEND:${ICS.toICSDateString(dtend)}\n`        +
                       `SUMMARY:${summary}\n`                         +
                       `DESCRIPTION:${description}\n`                 +
                       `LOCATION:${location}\n`                       +
                       "TRANSP:OPAQUE\n"                              +
                       "END:VEVENT\n"                                 ;
    }
    public getCalendar(): string {
        return "BEGIN:VCALENDAR\n"                    +
               "VERSION:2.0\n"                        +
               "PRODID:https://github.com/stormyyd\n" +
               this.events                            +
               "END:VCALENDAR"                        ;
    }
}

export default ICS;
