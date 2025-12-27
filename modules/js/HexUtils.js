/**
 * HexUtils.js
 * 
 * Hex grid geometry calculations and coordinate conversions.
 */

export class HexUtils {
    constructor(game) {
        this.game = game;
        
        // Hex grid parameters (cut from Game.js constructor)
        this.HEX_WIDTH = 57;           // horizontal spacing between columns
        this.HEX_HEIGHT = 65;          // vertical spacing between rows
        this.HEX_VERT_OFFSET = 33;     // vertical offset for even columns
        this.HEX_ORIGIN_X = 38;        // pixel X of origin hex center
        this.HEX_ORIGIN_Y = 230;       // pixel Y of origin hex center
        this.HEX_ORIGIN_COL = 1;       // column number of origin hex
        this.HEX_ORIGIN_ROW = 4;       // row number of origin hex
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
        if (col < 1 || col > 9 || row < 1 || row > 10) {
            return null; // Out of bounds
        }
        
        const hexId = String(col).padStart(2, '0') + String(row).padStart(2, '0');
        return hexId;
    }
}