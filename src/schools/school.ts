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

abstract class School {
    public static hostname: string[];
    public abstract getICSData(): string;
}

export default School;
