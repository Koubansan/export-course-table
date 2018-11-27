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

import * as schools from "./schools";

function saveFile(fileURL, filename): void {
    let element = document.createElement("a");
    element.href = fileURL;
    element.download = filename;
    element.style.display = "none";
    document.getElementsByTagName("body")[0].appendChild(element);
    element.click();
    element.remove();
}

function main(): void {
    for (let i in schools) {
        let school = schools[i];
        if (school.hostname.includes(location.hostname)) {
            let s = new school();
            let icsData = s.getICSData();
            let icsBlob = new Blob([ icsData ], { type: "text/plain" });
            let icsURL = URL.createObjectURL(icsBlob);
            saveFile(icsURL, "courses.ics");
            URL.revokeObjectURL(icsURL);
            return;
        }
    }
    alert("暂不支持");
}

main();
