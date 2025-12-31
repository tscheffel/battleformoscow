/**
 * UnitData.js
 * 
 * Contains all unit sprite data for German and Soviet units.
 */

export class UnitData {
    constructor() {
        // German units sprite data
        this.GERMAN_UNITS = [
            // Row 0 - Panzer Corps (y=2)
            { x: 2, y: 2, id: 'XLVI', type: 'armor', side: 'full', strength: 10, movement: 6 },
            { x: 48, y: 2, id: 'XXIV', type: 'armor', side: 'full', strength: 12, movement: 6 },
            { x: 95, y: 2, id: 'XLI', type: 'armor', side: 'full', strength: 12, movement: 6 },
            { x: 141, y: 2, id: 'LVII', type: 'armor', side: 'full', strength: 12, movement: 6 },
            { x: 370, y: 2, id: 'LVII', type: 'armor', side: 'reduced', strength: 6, movement: 6 },
            { x: 416, y: 2, id: 'XLI', type: 'armor', side: 'reduced', strength: 6, movement: 6 },
            { x: 462, y: 2, id: 'XXIV', type: 'armor', side: 'reduced', strength: 6, movement: 6 },
            { x: 508, y: 2, id: 'XLVI', type: 'armor', side: 'reduced', strength: 5, movement: 6 },
            
            // Row 1 - Mixed armor and infantry (y=48)
            { x: 2, y: 48, id: 'XXII', type: 'infantry', side: 'full', strength: 8, movement: 4 },
            { x: 49, y: 48, id: 'XXXV', type: 'infantry', side: 'full', strength: 8, movement: 4 },
            { x: 95, y: 48, id: 'XL', type: 'armor', side: 'full', strength: 8, movement: 6 },
            { x: 141, y: 48, id: 'XLVIII', type: 'armor', side: 'full', strength: 8, movement: 6 },
            { x: 188, y: 48, id: 'XLVII', type: 'armor', side: 'full', strength: 9, movement: 6 },
            { x: 233, y: 48, id: 'LVI', type: 'armor', side: 'full', strength: 9, movement: 6 },
            { x: 278, y: 48, id: 'LVI', type: 'armor', side: 'reduced', strength: 4, movement: 6 },
            { x: 324, y: 48, id: 'XLVII', type: 'armor', side: 'reduced', strength: 4, movement: 6 },
            { x: 370, y: 48, id: 'XLVIII', type: 'armor', side: 'reduced', strength: 4, movement: 6 },
            { x: 416, y: 48, id: 'XL', type: 'armor', side: 'reduced', strength: 4, movement: 6 },
            { x: 462, y: 48, id: 'XXXV', type: 'infantry', side: 'reduced', strength: 4, movement: 4 },
            { x: 508, y: 48, id: 'XXII', type: 'infantry', side: 'reduced', strength: 4, movement: 4 },
            
            // Row 2 - Infantry corps (y=94)
            { x: 2, y: 94, id: 'XX', type: 'infantry', side: 'full', strength: 6, movement: 4 },
            { x: 48, y: 94, id: 'XXVII', type: 'infantry', side: 'full', strength: 6, movement: 4 },
            { x: 95, y: 94, id: 'LIII', type: 'infantry', side: 'full', strength: 6, movement: 4 },
            { x: 141, y: 94, id: 'VII', type: 'infantry', side: 'full', strength: 7, movement: 4 },
            { x: 187, y: 94, id: 'VIII', type: 'infantry', side: 'full', strength: 7, movement: 4 },
            { x: 233, y: 94, id: 'IX', type: 'infantry', side: 'full', strength: 7, movement: 4 },
            { x: 278, y: 94, id: 'IX', type: 'infantry', side: 'reduced', strength: 3, movement: 4 },
            { x: 324, y: 94, id: 'VIII', type: 'infantry', side: 'reduced', strength: 3, movement: 4 },
            { x: 370, y: 94, id: 'VII', type: 'infantry', side: 'reduced', strength: 3, movement: 4 },
            { x: 416, y: 94, id: 'LIII', type: 'infantry', side: 'reduced', strength: 3, movement: 4 },
            { x: 462, y: 94, id: 'XXVII', type: 'infantry', side: 'reduced', strength: 3, movement: 4 },
            { x: 508, y: 94, id: 'XX', type: 'infantry', side: 'reduced', strength: 3, movement: 4 },
            
            // Row 3 - Infantry corps (y=140)
            { x: 2, y: 140, id: 'XXXIV', type: 'infantry', side: 'full', strength: 4, movement: 4 },
            { x: 48, y: 140, id: 'XLII', type: 'infantry', side: 'full', strength: 4, movement: 4 },
            { x: 95, y: 140, id: 'VI', type: 'infantry', side: 'full', strength: 5, movement: 4 },
            { x: 141, y: 140, id: 'XII', type: 'infantry', side: 'full', strength: 5, movement: 4 },
            { x: 187, y: 140, id: 'V', type: 'infantry', side: 'full', strength: 6, movement: 4 },
            { x: 233, y: 140, id: 'XIII', type: 'infantry', side: 'full', strength: 6, movement: 4 },
            { x: 278, y: 140, id: 'XIII', type: 'infantry', side: 'reduced', strength: 3, movement: 4 },
            { x: 324, y: 140, id: 'V', type: 'infantry', side: 'reduced', strength: 3, movement: 4 },
            { x: 370, y: 140, id: 'XII', type: 'infantry', side: 'reduced', strength: 2, movement: 4 },
            { x: 416, y: 140, id: 'VI', type: 'infantry', side: 'reduced', strength: 2, movement: 4 },
            { x: 462, y: 140, id: 'XLII', type: 'infantry', side: 'reduced', strength: 2, movement: 4 },
            { x: 508, y: 140, id: 'XXXIV', type: 'infantry', side: 'reduced', strength: 2, movement: 4 },
        ].map(unit => ({ ...unit, faction: 'german' }));  // add german faction to all units

        // Soviet units sprite data
        this.SOVIET_UNITS = [
            // Row 0 (y=186)
            { x: 2, y: 186, id: '33', type: 'infantry', side: 'full', strength: 8, movement: 4 },
            { x: 48, y: 186, id: '40', type: 'infantry', side: 'full', strength: 8, movement: 4 },
            { x: 94, y: 186, id: '43', type: 'infantry', side: 'full', strength: 8, movement: 4 },
            { x: 140, y: 186, id: '49', type: 'infantry', side: 'full', strength: 8, movement: 4 },
            { x: 186, y: 186, id: '50', type: 'infantry', side: 'full', strength: 8, movement: 4 },
            // { x: 232, y: 186, id: 'TU', type: 'armor', side: 'full', strength: 8, movement: 4 },
            // { x: 278, y: 186, id: 'TU', type: 'armor', side: 'reduced', strength: 4, movement: 4 },
            { x: 324, y: 186, id: '50', type: 'infantry', side: 'reduced', strength: 4, movement: 4 },
            { x: 370, y: 186, id: '49', type: 'infantry', side: 'reduced', strength: 4, movement: 4 },
            { x: 416, y: 186, id: '43', type: 'infantry', side: 'reduced', strength: 4, movement: 4 },
            { x: 462, y: 186, id: '40', type: 'infantry', side: 'reduced', strength: 4, movement: 4 },
            { x: 508, y: 186, id: '33', type: 'infantry', side: 'reduced', strength: 4, movement: 4 },
            
            // Row 1 (y=232)
            { x: 2, y: 232, id: '19', type: 'infantry', side: 'full', strength: 8, movement: 4 },
            { x: 48, y: 232, id: '20', type: 'infantry', side: 'full', strength: 8, movement: 4 },
            { x: 94, y: 232, id: '24', type: 'infantry', side: 'full', strength: 8, movement: 4 },
            { x: 140, y: 232, id: '29', type: 'infantry', side: 'full', strength: 8, movement: 4 },
            { x: 186, y: 232, id: '30', type: 'infantry', side: 'full', strength: 8, movement: 4 },
            { x: 232, y: 232, id: '32', type: 'infantry', side: 'full', strength: 8, movement: 4 },
            { x: 278, y: 232, id: '32', type: 'infantry', side: 'reduced', strength: 4, movement: 4 },
            { x: 324, y: 232, id: '30', type: 'infantry', side: 'reduced', strength: 4, movement: 4 },
            { x: 370, y: 232, id: '29', type: 'infantry', side: 'reduced', strength: 4, movement: 4 },
            { x: 416, y: 232, id: '24', type: 'infantry', side: 'reduced', strength: 4, movement: 4 },
            { x: 462, y: 232, id: '20', type: 'infantry', side: 'reduced', strength: 4, movement: 4 },
            { x: 508, y: 232, id: '19', type: 'infantry', side: 'reduced', strength: 4, movement: 4 },
            
            // Row 2 (y=278)
            { x: 2, y: 278, id: '1S', type: 'infantry', side: 'full', strength: 10, movement: 4 },  // 1st Shock Army (turn 4 reinforcement)
            { x: 48, y: 278, id: '3', type: 'infantry', side: 'full', strength: 8, movement: 4 },
            { x: 94, y: 278, id: '5', type: 'infantry', side: 'full', strength: 8, movement: 4 },
            { x: 140, y: 278, id: '10', type: 'infantry', side: 'full', strength: 8, movement: 4 },
            { x: 186, y: 278, id: '13', type: 'infantry', side: 'full', strength: 8, movement: 4 },
            { x: 232, y: 278, id: '16', type: 'infantry', side: 'full', strength: 8, movement: 4 },
            { x: 278, y: 278, id: '16', type: 'infantry', side: 'reduced', strength: 4, movement: 4 },
            { x: 324, y: 278, id: '13', type: 'infantry', side: 'reduced', strength: 4, movement: 4 },
            { x: 370, y: 278, id: '10', type: 'infantry', side: 'reduced', strength: 4, movement: 4 },
            { x: 416, y: 278, id: '5', type: 'infantry', side: 'reduced', strength: 4, movement: 4 },
            { x: 462, y: 278, id: '3', type: 'infantry', side: 'reduced', strength: 4, movement: 4 },
            { x: 508, y: 278, id: '1S', type: 'infantry', side: 'reduced', strength: 5, movement: 4 },  // 1st Shock Army reduced
        ].map(unit => ({ ...unit, faction: 'soviet', x: unit.x + 2, y: unit.y + 1 }));  // add soviet faction to all units, FIX X SPRITE CAPTURE WINDOW
    }
}