/*
 **********************************
 *  DO NOT USE THIS FILE DIRECTLY *
 **********************************
 *
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

javascript:(function() {
    s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "https://cdn.jsdelivr.net/gh/stormyyd/export-course-table/dist/export-course-table.min.js";
    var h = document.getElementsByTagName('head')[0];
    h.appendChild(s);
    h.removeChild(s);
})();
