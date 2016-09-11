/// <reference path="grid.decl.ts" />

namespace grid {

    export class CoordEx implements Coord {
        private readonly _row: number;
        private readonly _col: number;

        public constructor(row: number, col: number) {
            this._row = row;
            this._col = col;
        }

        public get row(): number {
            return this._row;
        }

        public get col(): number {
            return this._col;
        }

        public toString(): string {
            return "CoordEx[row={0} col={1}]".format(this._row, this._col);
        }
    }

    export class GridsEx implements Grids {
        private readonly _rows: number;
        private readonly _cols: number;

        private _shoot: JQuery;
        private _opponent: JQuery;

        constructor(rows: number, cols: number) {
            this._rows = rows;
            this._cols = cols;
        }

        public get shoot(): JQuery {
            return this._shoot;
        }

        public get opponent(): JQuery {
            return this._opponent;
        }

        public init(callback: () => void): void {
            this._shoot = this.newGrid("grid-shoot").append("#grid-shoot");
            this._opponent = this.newGrid("grid-opponent").append("#grid-opponent");
            callback();
        }

        public setClass(grid: JQuery, coord: Coord, clazz: string, keepCurrent: boolean): void {
            const $element: JQuery = grid
                .find("tr").eq(coord.row)
                .find("td").eq(coord.row);

            if (!keepCurrent) {
                $element.removeClass();
            }

            $element.addClass(clazz);
        }

        public reset(): void {
            this.shoot.find("td").attr("class", "unknown");
            this.opponent.find("td").attr("class", "unknown");
        }

        private newGrid(id: string): JQuery {
            const $table: JQuery = $("<table/>");

            for (let rowIt: number = 0; rowIt < this._rows; rowIt += 1) {
                const newRow: JQuery = this.createRow(id, rowIt);
                $table.append(newRow);
            }

            return $table;
        }

        private createRow(id: string, rowIndex: number): JQuery {
            const $row: JQuery = $("<tr/>");

            for (let colIt: number = 0; colIt < this._cols; colIt += 1) {
                const newCell: JQuery = this.createCell(id, rowIndex, colIt);
                $row.append(newCell);
            }

            return $row;
        }

        // tslint:disable:object-literal-key-quotes
        private createCell(id: string, rowIndex: number, colIndex: number): JQuery {
            return $("<td/>", {
                "class": "unknown",
                "data-grid-id": id,
                "data-row-i": rowIndex,
                "data-col-i": colIndex,
            });
        }
    }

    export class SelectionEx implements Selection {

        private readonly _grids: Grids;

        public constructor(grids: grid.Grids) {
            this._grids = grids;
        }

        public activate(): void {
            let isMouseDown: boolean = false;
            let isHighlighted: boolean = false;

            this._grids.shoot.find("td")
                .addClass("shoot-able")
                .mousedown(function (): boolean {
                    isMouseDown = true;
                    $(this).toggleClass("ship");
                    isHighlighted = $(this).hasClass("ship");
                    $(this).toggleClass("unknown", !isHighlighted);
                    return false;
                })

                .mouseover(function (): void {
                    if (isMouseDown) {
                        $(this).toggleClass("ship", isHighlighted);
                        $(this).toggleClass("unknown", !isHighlighted);
                    }
                })

                .on("selectstart", () => false);

            $(document)
                .mouseup(() => isMouseDown = false);
        }

        public deactivate(): void {
            this._grids.shoot.find("td")
                .removeClass("shoot-able")
                .off("mousedown")
                .off("mouseover")
                .off("selectstart");
            $(document).off("mousedown");
        }

        public collect(): string {
            return this._grids.shoot
                .find("tr").find("td")
                .map(function (): number {
                    return $(this).hasClass("ship") ? 1 : 0;
                })
                .get()
                .join();
        }

        public move(): void {
            const shoot: JQuery = this._grids.shoot.find("td");
            const opponent: JQuery = this._grids.opponent.find("td");

            for (let i: number = 0; i < shoot.length; i += 1) {
                const shootClass = shoot.eq(i).attr("class");
                shoot.eq(i).attr("class", "unknown");
                opponent.eq(i).attr("class", shootClass);
            }
        }
    }

    // --------------------------------------------------------------------------------------------------------------

    class Singleton {
        public grids: Grids = new GridsEx(10, 10);
        public selection: Selection = new SelectionEx(this.grids);
    }

    export const i: Singleton = new Singleton();
}
