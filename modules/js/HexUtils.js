/**
 * HexUtils.js
 * 
 * Hex grid geometry calculations and coordinate conversions.
 */

export class HexUtils {
    constructor(game) {
        this.game = game;
        
        // Hex grid parameters
        this.HEX_WIDTH = 57;           // horizontal spacing between columns
        this.HEX_HEIGHT = 65;          // vertical spacing between rows
        this.HEX_VERT_OFFSET = 33;     // vertical offset for even columns
        this.HEX_ORIGIN_X = 38;        // pixel X of origin hex center
        this.HEX_ORIGIN_Y = 230;       // pixel Y of origin hex center
        this.HEX_ORIGIN_COL = 1;       // column number of origin hex
        this.HEX_ORIGIN_ROW = 4;       // row number of origin hex

        // Hex grid boundaries
        this.MIN_ROW = 1;
        this.MAX_ROW = 10;
        this.MIN_COL = 1;
        this.MAX_COL = 14;
    }

    /**
     * Gets the six adjacent hexes for a given hex.
     * @param {string} hexId - Hex ID in XXYY format
     * @returns {string[]} Array of adjacent hex IDs (may be less than 6 if on map edge)
     */
    getAdjacentHexes(hexId) {
        const col = parseInt(hexId.substring(0, 2));
        const row = parseInt(hexId.substring(2, 4));
        
        const isEvenCol = (col % 2 === 0);
        
        // Direction offsets depend on whether column is even or odd
        // For odd columns (1, 3, 5...):
        //   N: (0, -1), NE: (+1, -1), SE: (+1, 0), S: (0, +1), SW: (-1, 0), NW: (-1, -1)
        // For even columns (2, 4, 6...):
        //   N: (0, -1), NE: (+1, 0), SE: (+1, +1), S: (0, +1), SW: (-1, +1), NW: (-1, 0)
        
        const offsets = isEvenCol ? [
            { dir: 'N',  dcol: 0,  drow: -1 },
            { dir: 'NE', dcol: 1,  drow: 0 },
            { dir: 'SE', dcol: 1,  drow: 1 },
            { dir: 'S',  dcol: 0,  drow: 1 },
            { dir: 'SW', dcol: -1, drow: 1 },
            { dir: 'NW', dcol: -1, drow: 0 }
        ] : [
            { dir: 'N',  dcol: 0,  drow: -1 },
            { dir: 'NE', dcol: 1,  drow: -1 },
            { dir: 'SE', dcol: 1,  drow: 0 },
            { dir: 'S',  dcol: 0,  drow: 1 },
            { dir: 'SW', dcol: -1, drow: 0 },
            { dir: 'NW', dcol: -1, drow: -1 }
        ];
        
        const neighbors = [];
        
        for (const offset of offsets) {
            const newCol = col + offset.dcol;
            const newRow = row + offset.drow;
            
            // Check if within map bounds
            if (newCol >= this.MIN_COL && newCol <= this.MAX_COL && 
                newRow >= this.MIN_ROW && newRow <= this.MAX_ROW) {
                const neighborId = String(newCol).padStart(2, '0') + String(newRow).padStart(2, '0');
                neighbors.push(neighborId);
            }
        }
        
        return neighbors;
    }

    /**
     * Converts a hex ID to pixel coordinates for unit placement.
     * @param {string} hexId - Hex identifier in XXYY format (e.g., "0304")
     * @returns {{x: number, y: number}} Pixel coordinates for centering a unit in the hex
     */
    hexToUnitPixelCoords(hexId) {
        // Parse hex ID (format: XXYY where XX=column, YY=row)
        const col = parseInt(hexId.substring(0, 2));
        const row = parseInt(hexId.substring(2, 4));
        
        let pixelX = this.HEX_ORIGIN_X + (col - this.HEX_ORIGIN_COL) * this.HEX_WIDTH;
        let pixelY = this.HEX_ORIGIN_Y + (row - this.HEX_ORIGIN_ROW) * this.HEX_HEIGHT;
        
        if (col % 2 === 0) {
            pixelY += this.HEX_VERT_OFFSET;
        }
        
        // Center the unit counter in the hex (x coord seems to need shifted left 1 pixel)
        pixelX -= this.game.UNIT_WIDTH / 2 + 1;  // determines pixel location for the unit's left edge
        pixelY -= this.game.UNIT_HEIGHT / 2;     // determines pixel location for the unit's top edge
        
        return { x: pixelX, y: pixelY };
    }

    /**
    * Converts pixel coordinates to hex ID.
    * @param {number} pixelX - X coordinate relative to map
    * @param {number} pixelY - Y coordinate relative to map
    * @returns {string|null} Hex ID in XXYY format, or null if out of bounds
    */
    pixelToHexId(pixelX, pixelY) {
        // Convert pixel coordinates to hex column and row
        // This is the inverse of hexToUnitPixelCoords
        
        // Calculate relative to origin
        const relX = pixelX - this.HEX_ORIGIN_X;
        const relY = pixelY - this.HEX_ORIGIN_Y;
        
        // Estimate column (will refine based on vertical offset)
        let col = Math.round(relX / this.HEX_WIDTH) + this.HEX_ORIGIN_COL;
        
        // Adjust Y for even column offset
        const adjustedY = (col % 2 === 0) ? relY - this.HEX_VERT_OFFSET : relY;
        
        // Calculate row
        let row = Math.round(adjustedY / this.HEX_HEIGHT) + this.HEX_ORIGIN_ROW;
        
        // Format as 4-digit hex ID
        if (col < this.MIN_COL || col > this.MAX_COL || row < this.MIN_ROW || row > this.MAX_ROW) {
            return null; // Out of bounds
        }
        
        const hexId = String(col).padStart(2, '0') + String(row).padStart(2, '0');
        return hexId;
    }
}