/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * BattleForMoscow implementation : © <Your name here> <Your email address here>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * Game.js
 *
 * BattleForMoscow user interface script
 * 
 * In this file, you are describing the logic of your user interface, in Javascript language.
 *
 */

export class Game {
    constructor(bga) {
        console.log('battleformoscow constructor');
        this.bga = bga;
            
        // Expose for debugging
        window.das_game = this;

        // Here, you can init the global variables of your user interface
        // Example:
        // this.myGlobalValue = 0;

        // Image file paths
        this.SPRITE_SHEET = `${g_gamethemeurl}img/units_initial_exported.png`;
        this.MAP_IMAGE = `${g_gamethemeurl}img/game_map_second_source_cropped.png`;  // Update with actual map filename

        // Unit display constants
        this.UNIT_WIDTH = 44;
        this.UNIT_HEIGHT = 44;

        // Hex grid parameters
        this.HEX_WIDTH = 57;           // horizontal spacing between columns
        this.HEX_HEIGHT = 65;          // vertical spacing between rows
        this.HEX_VERT_OFFSET = 33;     // vertical offset for even columns
        this.HEX_ORIGIN_X = 38;        // pixel X of origin hex center
        this.HEX_ORIGIN_Y = 230;       // pixel Y of origin hex center
        this.HEX_ORIGIN_COL = 1;       // column number of origin hex
        this.HEX_ORIGIN_ROW = 4;       // row number of origin hex

        this.PANEL_GAP = 5;            // Gap in pixels between map and setup panel
        this.GERMAN_SETUP_PANEL_WIDTH = 300;  // panel width in pixels

        this.START_HEXES_SOVIET = ['0301','0302','0303','0304','0405','0504','0505','0506','0507','0508','0509','0510','0803'];
        this.START_HEXES_GERMAN = ['0103','0104','0106','0107','0201','0202','0203','0204','0205','0206','0209','0210','0305','0306','0307','0309','0310','0406','0407','0408','0409','0410'];

// {
//     "0301": {
//         "terrain": "clear",
//         "city": null,
//         "rail": [],
//         "road": [],
//         "river": [],
//         "setupSide": "soviet"
//     },
// }
        // terrain = 'clear', 'forest', or 'fort' |  city = null, 'small', or 'moscow' | setupSide = null, 'german' or 'soviet' | features = [] or N, NE, SE, S, SW, NW, e.g. road: ['N', 'S']
        this.HEX_DATA = {
            '0101': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0102': { terrain: 'clear', city: null, setupSide: null, rail: ['NE','NW'], road: [], river: [] },
            '0103': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0104': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0105': { terrain: 'clear', city: null, setupSide: null, rail: ['NE','NW'], road: [], river: [] },
            '0106': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0107': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0108': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0109': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0110': { terrain: 'clear', city: null, setupSide: null, rail: ['NE','NW'], road: [], river: [] },
            '0201': { terrain: 'forest', city: null, setupSide: null, rail: ['SE','SW'], road: [], river: [] },
            '0202': { terrain: 'forest', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0203': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0204': { terrain: 'clear', city: 'small', setupSide: null, rail: ['SE','SW'], road: [], river: [] },
            '0205': { terrain: 'clear', city: null, setupSide: null, rail: ['N','SE'], road: [], river: [] },
            '0206': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0207': { terrain: 'forest', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0208': { terrain: 'forest', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0209': { terrain: 'clear', city: null, setupSide: null, rail: ['SE','SW'], road: [], river: [] },
            '0210': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0301': { terrain: 'forest', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0302': { terrain: 'clear', city: null, setupSide: null, rail: ['SE','SW'], road: [], river: [] },
            '0303': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0304': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0305': { terrain: 'clear', city: null, setupSide: null, rail: ['NE','NW'], road: [], river: [] },
            '0306': { terrain: 'clear', city: null, setupSide: null, rail: ['S','NW'], road: [], river: [] },
            '0307': { terrain: 'clear', city: 'small', setupSide: null, rail: ['N','SE'], road: [], river: [] },
            '0308': { terrain: 'forest', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0309': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0310': { terrain: 'clear', city: null, setupSide: null, rail: ['NE','NW'], road: [], river: [] },
            '0401': { terrain: 'forest', city: null, setupSide: null, rail: ['SE','SW'], road: [], river: [] },
            '0402': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0403': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0404': { terrain: 'clear', city: null, setupSide: null, rail: ['NE','SW'], road: [], river: [] },
            '0405': { terrain: 'forest', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0406': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0407': { terrain: 'clear', city: null, setupSide: null, rail: ['SE','NW'], road: [], river: [] },
            '0408': { terrain: 'forest', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0409': { terrain: 'forest', city: null, setupSide: null, rail: ['NE','SW'], road: [], river: [] },
            '0410': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0501': { terrain: 'fort', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0502': { terrain: 'fort', city: null, setupSide: null, rail: ['NE','NW'], road: [], river: [] },
            '0503': { terrain: 'fort', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0504': { terrain: 'fort', city: null, setupSide: null, rail: ['NE','SW'], road: [], river: [] },
            '0505': { terrain: 'fort', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0506': { terrain: 'fort', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0507': { terrain: 'fort', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0508': { terrain: 'clear', city: null, setupSide: null, rail: ['S','NW'], road: [], river: [] },
            '0509': { terrain: 'clear', city: 'small', setupSide: null, rail: ['NE','SE','S','SW'], road: [], river: [] },
            '0510': { terrain: 'forest', city: null, setupSide: null, rail: ['N','S'], road: [], river: [] },
            '0601': { terrain: 'clear', city: 'small', setupSide: null, rail: ['SE','S','SW'], road: [], river: [] },
            '0602': { terrain: 'clear', city: null, setupSide: null, rail: ['N','S'], road: [], river: [] },
            '0603': { terrain: 'clear', city: 'small', setupSide: null, rail: ['N','SE','SW'], road: [], river: [] },
            '0604': { terrain: 'forest', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0605': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0606': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0607': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0608': { terrain: 'clear', city: null, setupSide: null, rail: ['NE','SW'], road: [], river: [] },
            '0609': { terrain: 'clear', city: null, setupSide: null, rail: ['SE','NW'], road: [], river: [] },
            '0610': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0701': { terrain: 'forest', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0702': { terrain: 'forest', city: null, setupSide: null, rail: ['SE','NW'], road: [], river: [] },
            '0703': { terrain: 'forest', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0704': { terrain: 'forest', city: null, setupSide: null, rail: ['NE','NW'], road: [], river: [] },
            '0705': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0706': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0707': { terrain: 'clear', city: null, setupSide: null, rail: ['NE','S'], road: [], river: [] },
            '0708': { terrain: 'forest', city: null, setupSide: null, rail: ['N','SW'], road: [], river: [] },
            '0709': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0710': { terrain: 'clear', city: null, setupSide: null, rail: ['NE','NW'], road: [], river: [] },
            '0801': { terrain: 'fort', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0802': { terrain: 'fort', city: null, setupSide: null, rail: ['SE','NW'], road: [], river: [] },
            '0803': { terrain: 'fort', city: 'small', setupSide: null, rail: ['NE','SW'], road: [], river: [] },
            '0804': { terrain: 'fort', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0805': { terrain: 'fort', city: 'small', setupSide: null, rail: ['NE','S'], road: [], river: [] },
            '0806': { terrain: 'forest', city: null, setupSide: null, rail: ['N','SW'], road: [], river: [] },
            '0807': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0808': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0809': { terrain: 'clear', city: 'small', setupSide: null, rail: ['NE','S','SW'], road: [], river: [] },
            '0810': { terrain: 'clear', city: null, setupSide: null, rail: ['N','S'], road: [], river: [] },
            '0901': { terrain: 'forest', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0902': { terrain: 'forest', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0903': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0904': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0905': { terrain: 'forest', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0906': { terrain: 'forest', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0907': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0908': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0909': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '0910': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1001': { terrain: 'fort', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1002': { terrain: 'fort', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1003': { terrain: 'fort', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1004': { terrain: 'fort', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1005': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1006': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1007': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1008': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1009': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1010': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1101': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1102': { terrain: 'fort', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1103': { terrain: 'clear', city: 'moscow', setupSide: null, rail: [], road: [], river: [] },
            '1104': { terrain: 'fort', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1105': { terrain: 'fort', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1106': { terrain: 'fort', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1107': { terrain: 'fort', city: 'small', setupSide: null, rail: [], road: [], river: [] },
            '1108': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1109': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1110': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1201': { terrain: 'forest', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1202': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1203': { terrain: 'fort', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1204': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1205': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1206': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1207': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1208': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1209': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1210': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1301': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1302': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1303': { terrain: 'forest', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1304': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1305': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1306': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1307': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1308': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1309': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1310': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1401': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1402': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1403': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1404': { terrain: 'forest', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1405': { terrain: 'clear', city: 'small', setupSide: null, rail: [], road: [], river: [] },
            '1406': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1407': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1408': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1409': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] },
            '1410': { terrain: 'clear', city: null, setupSide: null, rail: [], road: [], river: [] }
        };

        // Game state tracking
        this.currentTurn = 1;
        this.currentPhase = 1;  // 1-8 (see phase list in comments)
        this.activePlayer = null;  // Will be set from gamedatas
        
        // Phase definitions for reference
        this.PHASES = {
            1: { name: 'German Replacement Phase', player: 'german' },
            2: { name: 'German Panzer Movement Phase', player: 'german' },
            3: { name: 'German Combat Phase', player: 'german' },
            4: { name: 'German Movement Phase', player: 'german' },
            5: { name: 'Soviet Replacement Phase', player: 'soviet' },
            6: { name: 'Soviet Rail Movement Phase', player: 'soviet' },
            7: { name: 'Soviet Combat Phase', player: 'soviet' },
            8: { name: 'Soviet Movement Phase', player: 'soviet' }
        };

        // Add to constructor after PHASES definition:
        this.selectedUnit = null;
        this.moveHistory = [];  // Track moves for undo/reset
        this.unitsMovedThisPhase = new Set();  // Track which units have moved

        this.unitRegistry = new Map();  // Maps hexId -> unit data

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
        ];

        // Soviet units sprite data
        this.SOVIET_UNITS = [
            // Row 0 (y=186)
            { x: 2, y: 186, id: '33', type: 'infantry', side: 'full', strength: 8, movement: 4 },
            { x: 48, y: 186, id: '40', type: 'infantry', side: 'full', strength: 8, movement: 4 },
            { x: 94, y: 186, id: '43', type: 'infantry', side: 'full', strength: 8, movement: 4 },
            { x: 140, y: 186, id: '49', type: 'infantry', side: 'full', strength: 8, movement: 4 },
            { x: 186, y: 186, id: '50', type: 'infantry', side: 'full', strength: 8, movement: 4 },
            { x: 232, y: 186, id: 'TU', type: 'armor', side: 'full', strength: 8, movement: 4 },
            { x: 278, y: 186, id: 'TU', type: 'armor', side: 'reduced', strength: 4, movement: 4 },
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
        ];
    }
    
    /*
        setup:
        
        This method must set up the game user interface according to current game situation specified
        in parameters.
        
        The method is called each time the game interface is displayed to a player, ie:
        _ when the game starts
        _ when a player refreshes the game page (F5)
        
        "gamedatas" argument contains all datas retrieved by your "getAllDatas" PHP method.
    */
    
    setup( gamedatas ) {
        console.log( "Starting game setup" );
        this.gamedatas = gamedatas;

        // Example to add a div on the game area
        this.bga.gameArea.getElement().insertAdjacentHTML('beforeend', `
            <div id="player-tables"></div>
        `);

        this.bga.gameArea.getElement().insertAdjacentHTML('beforeend', `
            <div id="game_map">
            </div>
        `);
        
        this.bga.gameArea.getElement().insertAdjacentHTML('beforebegin', `
            <div id="coord_display" style="display: inline-block; background: rgba(0,0,0,0.7); color: white; padding: 5px; font-family: monospace;">
                Hex: -- | Pixel: --
            </div>
        `);

        // Initialize game state from server data
        this.currentTurn = gamedatas.gamestate.turn || 1;
        this.currentPhase = gamedatas.gamestate.phase || 1;
        this.activePlayer = gamedatas.gamestate.active_player;

        // Setting up player boards
        Object.values(gamedatas.players).forEach(player => {
            // example of setting up players boards
            this.bga.playerPanels.getElement(player.id).insertAdjacentHTML('beforeend', `
                <span id="energy-player-counter-${player.id}"></span> Energy
            `);
            const counter = new ebg.counter();
            counter.create(`energy-player-counter-${player.id}`, {
                value: player.energy,
                playerCounter: 'energy',
                playerId: player.id
            });
        });
        
        // TODO: Set up your game interface here, according to "gamedatas"

        // Setup game notifications to handle (see "setupNotifications" method below)
        this.setupNotifications();

        // Add mousemove tracking for coordinates
        dojo.connect($('game_map'), 'mousemove', this, 'onMouseMove');

        // Add click tracking for German setup
        dojo.connect($('game_map'), 'click', this, 'onMapClick');

        console.log( "Setting up Soviet units" );
        this.setupSovietStartingUnits();
        console.log( "Setting up German units" );
        this.setupGermanUnits();

// Add this temporarily in your setup() method
const exportBtn = document.createElement('button');
exportBtn.textContent = 'Export HEX_DATA';
exportBtn.style.cssText = `
    position: fixed;
    top: 50px;
    right: 10px;
    padding: 10px 20px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    z-index: 9999;
    font-size: 14px;
`;
exportBtn.onclick = () => {
    try {
        console.log('Inside export button click');
        
        // Sort the HEX_DATA by column then row (numerically)
        const sortedKeys = Object.keys(this.HEX_DATA)
            .sort((a, b) => {
                const colA = parseInt(a.substring(0, 2));
                const rowA = parseInt(a.substring(2, 4));
                const colB = parseInt(b.substring(0, 2));
                const rowB = parseInt(b.substring(2, 4));
                
                // Sort by column first
                if (colA !== colB) return colA - colB;
                // Then by row
                return rowA - rowB;
            });
        
        console.log('Keys sorted, first 20:', sortedKeys.slice(0, 20));
        
        // Manually build JSON to preserve order
        let json = '{\n';
        sortedKeys.forEach((key, index) => {
            const value = JSON.stringify(this.HEX_DATA[key]);
            json += `  "${key}": ${value}`;
            if (index < sortedKeys.length - 1) json += ',';
            json += '\n';
        });
        json += '}';
        
        console.log('JSON built, first 500 chars:', json.substring(0, 500));
        
        navigator.clipboard.writeText(json).then(() => {
            alert('HEX_DATA copied to clipboard!');
        }).catch(err => {
            console.log('Copy failed:', err);
            console.log(json);
            alert('Could not copy - check console');
        });
    } catch(err) {
        console.error('Export error:', err);
    }
};
document.body.appendChild(exportBtn);

        console.log( "Ending game setup" );
    }

    setupSovietStartingUnits() {
        this.START_HEXES_SOVIET.forEach(hexId => {
            const pos = this.hexToUnitPixelCoords(hexId);
            
            const unitDiv = document.createElement('div');
            unitDiv.className = 'unit soviet-infantry';  // Use the CSS class
            unitDiv.id = `unit_${hexId}`;
            unitDiv.style.left = pos.x + 'px';
            unitDiv.style.top = pos.y + 'px';
            
            $('game_map').appendChild(unitDiv);
        });
    }

    setupGermanUnits() {
        // Create unit selection panel
        const panelHTML = `
            <div id="german_setup_panel" style="
                width: 300px;
                max-height: 60vh;
                background: rgba(40, 60, 80, 0.95);
                border: 2px solid #666;
                border-radius: 8px;
                padding: 15px;
                color: white;
                font-family: Arial, sans-serif;
                z-index: 10;
            ">
                <h3 style="margin: 0 0 10px 0; text-align: center;">German Setup</h3>
                <div style="font-size: 12px; margin-bottom: 10px; text-align: center;">
                    Select unit, then click a highlighted hex
                </div>
                <button id="auto_place_german_units" style="
                    width: 100%;
                    padding: 8px;
                    background: #2196F3;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    margin-bottom: 10px;
                ">Auto-place All Units</button>
                <div id="german_unit_list" style="
                    max-height: 450px;
                    overflow-y: auto;
                    margin-bottom: 10px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    background: white;
                    padding: 5px;
                ">
                    <!-- Units will be added in here -->
                </div>
                <button id="finish_german_setup" style="
                    width: 100%;
                    padding: 10px;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    display: none;
                ">Finish Setup</button>
            </div>
        `;
        
        // Append to game_play_area instead of document.body
        const gamePlayArea = document.getElementById('game_play_area');
        gamePlayArea.insertAdjacentHTML('beforeend', panelHTML);
        
        // Add auto-place button handler HERE
        const autoPlaceBtn = document.getElementById('auto_place_german_units');
        if (autoPlaceBtn) {
            autoPlaceBtn.addEventListener('click', () => this.autoPlaceGermanUnits());
        }

        // Add close button handler
        const closeBtn = document.getElementById('close-setup-panel');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeGermanSetupPanel());
        }
        
        // Populate with German units
        this.populateGermanUnitPanel();
        
        // Give the DOM a moment to render, then position
        setTimeout(() => {
            this.positionPanelNextToMap();
        }, 150);
        
        this.resizeHandler = this.positionPanelNextToMap.bind(this);
        window.addEventListener('resize', this.resizeHandler);
        
        // Highlight available starting hexes
        this.highlightGermanStartingHexes();
    }
    
    populateGermanUnitPanel() {
        const unitList = document.getElementById('german_unit_list');
        
        // Get only full strength German units (no reduced sides)
        const fullStrengthUnits = this.GERMAN_UNITS.filter(u => u.side === 'full');
        
        // Track setup state
        this.germanSetupState = {
            selectedUnit: null,
            placedUnits: new Map(), // hexId -> unit data
            availableUnits: new Set(fullStrengthUnits.map(u => u.id))
        };
        
        fullStrengthUnits.forEach(unit => {
            const unitDiv = document.createElement('div');
            unitDiv.id = `setup_unit_${unit.id}`;
            unitDiv.className = 'setup-unit';
            unitDiv.style.cssText = `
                cursor: pointer;
            `;
            
            // Create unit sprite
            const sprite = document.createElement('div');
            sprite.style.cssText = `
                width: ${this.UNIT_WIDTH}px;
                height: ${this.UNIT_HEIGHT}px;
                background-image: url('${this.SPRITE_SHEET}');
                background-position: -${unit.x}px -${unit.y}px;
            `;

            unitDiv.appendChild(sprite);
            
            // Click handler for unit selection
            unitDiv.addEventListener('click', () => this.onSetupUnitClick(unit));
            
            unitList.appendChild(unitDiv);
        });

        // Auto-select first unit
        if (fullStrengthUnits.length > 0) {
            this.onSetupUnitClick(fullStrengthUnits[0]);
        }
    }

    closeGermanSetupPanel() {
        const panel = document.getElementById('german_setup_panel');
        if (panel) {
            panel.remove();
        }
        
        // Clean up resize listener
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
            this.resizeHandler = null;
        }
        
        // Clear highlights and selection state
        this.clearGermanStartingHexHighlights();
        this.selectedGermanUnit = null;
    }

    showPhaseControlPanel() {
        // Remove any existing panel
        const existingPanel = document.getElementById('phase_control_panel');
        if (existingPanel) existingPanel.remove();
        
        const phaseInfo = this.PHASES[this.currentPhase];
        
        const panelHTML = `
            <div id="phase_control_panel">
                <h3>Turn ${this.currentTurn} - Phase ${this.currentPhase}</h3>
                <h4>${phaseInfo.name}</h4>
                <button id="end_phase_button">End Phase</button>
                <button id="undo_move_button" disabled>Undo Last Move</button>
                <button id="reset_moves_button" disabled>Reset All Moves</button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', panelHTML);
        
        // Add button handlers
        document.getElementById('end_phase_button').addEventListener('click', () => {
            this.endCurrentPhase();
        });
        
        document.getElementById('undo_move_button').addEventListener('click', () => {
            this.undoLastMove();
        });
        
        document.getElementById('reset_moves_button').addEventListener('click', () => {
            this.resetAllMoves();
        });
    }

    updatePhaseControlPanel() {
        const panel = document.getElementById('phase_control_panel');
        if (!panel) return;
        
        const phaseInfo = this.PHASES[this.currentPhase];
        panel.querySelector('h3').textContent = `Turn ${this.currentTurn} - Phase ${this.currentPhase}`;
        panel.querySelector('h4').textContent = phaseInfo.name;
    }

    hidePhaseControlPanel() {
        const panel = document.getElementById('phase_control_panel');
        if (panel) panel.remove();
    }

    endCurrentPhase() {
        console.log('Ending phase', this.currentPhase);
        // TODO: Validate phase completion, advance to next phase
    }

    undoLastMove() {
        console.log('Undo last move');
        // TODO: Implement undo logic
    }

    resetAllMoves() {
        console.log('Reset all moves');
        // TODO: Implement reset logic
    }

    // Add this stub method after populateGermanUnitPanel():
    highlightGermanStartingHexes() {
        this.START_HEXES_GERMAN.forEach(hexId => {
            const pos = this.hexToUnitPixelCoords(hexId);
            
            const highlightDiv = document.createElement('div');
            highlightDiv.className = 'german-start-hex';
            highlightDiv.id = `start_hex_${hexId}`;
            highlightDiv.style.cssText = `
                position: absolute;
                left: ${pos.x - 1}px;
                top: ${pos.y + 1}px;
                width: 44px;
                height: 44px;
                background: rgba(100, 149, 237, 0.3);
                border: 2px solid #6495ED;
                border-radius: 50%;
                pointer-events: none;
                z-index: 5;
            `;
            
            $('game_map').appendChild(highlightDiv);
        });
    }

    clearGermanStartingHexHighlights() {
       this.START_HEXES_GERMAN.forEach(hexId => {
           const highlight = document.getElementById(`start_hex_${hexId}`);
           if (highlight) highlight.remove();
       });
   }

    onMapClick(evt) {
        // Only handle clicks during German setup
        if (!this.germanSetupState) return;
        
        // Check if a unit is selected
        if (!this.germanSetupState.selectedUnit) return;
        
        // Get click coordinates relative to the map
        const rect = $('game_map').getBoundingClientRect();
        const pixelX = evt.clientX - rect.left;
        const pixelY = evt.clientY - rect.top;
        
        // Convert to hex ID
        const hexId = this.pixelToHexId(pixelX, pixelY);
        if (!hexId) return;
        
        // Check if this is a valid starting hex
        if (!this.START_HEXES_GERMAN.includes(hexId)) {
            console.log('Not a German starting hex:', hexId);
            return;
        }
        
        // Check if hex is already occupied
        if (this.germanSetupState.placedUnits.has(hexId)) {
            console.log('Hex already occupied:', hexId);
            return;
        }
        
        // Place the unit
        this.placeGermanUnit(this.germanSetupState.selectedUnit, hexId);
    }

    enableUnitSelection() {
        // Get all German units on the map
        const germanUnits = document.querySelectorAll('.unit.german-unit');
        
        germanUnits.forEach(unitDiv => {
            unitDiv.addEventListener('click', (evt) => {
                evt.stopPropagation();
                this.onUnitClick(unitDiv);
            });
            // Add visual indication that units are clickable
            unitDiv.style.cursor = 'pointer';
        });
    }

    onUnitClick(unitDiv) {
        const hexId = unitDiv.id.replace('unit_', '');
        const unit = this.unitRegistry.get(hexId);
    
        if (!unit) {
            console.log('Unit data not found for hex:', hexId);
            return;
        }

        console.log('Unit clicked:', unit.id, 'Type:', unit.type, 'at hex:', hexId);

        // Check if unit can move in current phase
        if (this.currentPhase === 2) {
            // German Panzer Movement Phase - only armor can move
            if (unit.type !== 'armor') {
                console.log('Only panzers can move in Phase 2');
                return;
            }
        }
        
        // Check if unit already moved this phase (except panzers in phase 4)
        if (this.unitsMovedThisPhase.has(hexId) && this.currentPhase !== 4) {
            console.log('Unit already moved this phase');
            return;
        }
        
        // Select the unit
        this.selectUnit(unitDiv, hexId, unit);
    }

    selectUnit(unitDiv, hexId, unit) {
        // Deselect previous unit
        if (this.selectedUnit) {
            this.selectedUnit.div.style.outline = 'none';
            this.clearMovementRange();
        }
        
        // Select new unit
        this.selectedUnit = {
            div: unitDiv,
            hexId: hexId,
            unit: unit
        };
        
        // Visual feedback
        unitDiv.style.outline = '3px solid yellow';
        
        // Show movement range
        this.showMovementRange(hexId, unit);
        console.log('Unit selected at hex:', hexId);
    }

    showMovementRange(hexId, unit) {
        // TODO: Calculate and display valid movement hexes
        console.log('Showing movement range for hex:', hexId, 'Unit:', unit.id, 'Movement:', unit.movement);
    }

    clearMovementRange() {
        // TODO: Remove movement range highlights
        console.log('Clearing movement range');
    }

    placeGermanUnit(unit, hexId) {
        console.log('Placing unit', unit.id, 'on hex', hexId);
        
        // Get position for the unit
        const pos = this.hexToUnitPixelCoords(hexId);
        
        // Create unit div on the map
        const unitDiv = document.createElement('div');
        unitDiv.className = 'unit german-unit';
        unitDiv.id = `unit_${hexId}`;
        unitDiv.style.cssText = `
            position: absolute;
            left: ${pos.x}px;
            top: ${pos.y}px;
            width: ${this.UNIT_WIDTH}px;
            height: ${this.UNIT_HEIGHT}px;
            background-image: url('${this.SPRITE_SHEET}');
            background-position: -${unit.x}px -${unit.y}px;
            cursor: pointer;
            z-index: 10;
        `;
        
        // Click handler to pick unit back up
        unitDiv.addEventListener('click', (evt) => {
            evt.stopPropagation(); // Prevent map click
            this.pickupGermanUnit(hexId);
        });
        
        $('game_map').appendChild(unitDiv);
        
        // Update state
        this.germanSetupState.placedUnits.set(hexId, unit);
        this.germanSetupState.availableUnits.delete(unit.id);
        
        // Remove from panel
        const panelUnit = document.getElementById(`setup_unit_${unit.id}`);
        if (panelUnit) panelUnit.remove();
        
        // Clear selection
        this.germanSetupState.selectedUnit = null;
        
        // Auto-select next unit in sequence
        const fullStrengthUnits = this.GERMAN_UNITS.filter(u => u.side === 'full');
        const currentIndex = fullStrengthUnits.findIndex(u => u.id === unit.id);

        // Search forward first, then wrap around to beginning
        let foundNext = false;
        for (let i = currentIndex + 1; i < fullStrengthUnits.length; i++) {
            if (this.germanSetupState.availableUnits.has(fullStrengthUnits[i].id)) {
                this.onSetupUnitClick(fullStrengthUnits[i]);
                foundNext = true;
                break;
            }
        }

        // If nothing found forward, search from beginning
        if (!foundNext) {
            for (let i = 0; i < currentIndex; i++) {
                if (this.germanSetupState.availableUnits.has(fullStrengthUnits[i].id)) {
                    this.onSetupUnitClick(fullStrengthUnits[i]);
                    break;
                }
            }
        }

        // Remove highlight from hex
        const highlight = document.getElementById(`start_hex_${hexId}`);
        if (highlight) highlight.remove();
        
        // Check if setup is complete
        this.checkGermanSetupComplete();
    }

    autoPlaceGermanUnits() {
        // Get all full strength units
        const fullStrengthUnits = this.GERMAN_UNITS.filter(u => u.side === 'full');
        
        // Place each unit on a starting hex
        fullStrengthUnits.forEach((unit, index) => {
            if (index < this.START_HEXES_GERMAN.length) {
                const hexId = this.START_HEXES_GERMAN[index];
                this.placeGermanUnit(unit, hexId);
            }
        });
    }

    checkGermanSetupComplete() {
        // Check if all 22 units are placed
        if (this.germanSetupState.placedUnits.size === 22) {
            console.log('German setup complete!');
            
            // Show the "Finish Setup" button
            const finishButton = document.getElementById('finish_german_setup');
            if (finishButton) {
                finishButton.style.display = 'block';
                
                // Add click handler
                finishButton.addEventListener('click', () => this.finishGermanSetup());
            }
        }
    }

    finishGermanSetup() {
        console.log('Finishing German setup...');
        
        // Remove click handlers from all placed German units
        this.germanSetupState.placedUnits.forEach((unit, hexId) => {
            this.unitRegistry.set(hexId, unit);

            const unitDiv = document.getElementById(`unit_${hexId}`);
            if (unitDiv) {
                // Clone the node to remove all event listeners
                const newUnitDiv = unitDiv.cloneNode(true);
                unitDiv.parentNode.replaceChild(newUnitDiv, unitDiv);
            }
        });

        // Remove the setup panel
        const panel = document.getElementById('german_setup_panel');
        if (panel) panel.remove();
        
        // Clear setup state
        this.germanSetupState = null;
        
        // TODO: Send the unit placement to the server
        // For now, just log the placements
        console.log('German units placed:');
        // We'll need to send this data to PHP later
        
        // TODO: Proceed to next game phase
        console.log('German setup complete - ready for game to begin!');

        // Show phase control panel
        this.showPhaseControlPanel();
        
        // Show phase 1 notification
        this.showPhasePanel(
            this.currentTurn, 
            this.currentPhase, 
            this.PHASES[this.currentPhase].name, 
            'No German replacements on Turn 1. This phase is skipped.', 
            true
        );

        // Enable unit selection for gameplay
        this.enableUnitSelection();
    }

    pickupGermanUnit(hexId) {
        const unit = this.germanSetupState.placedUnits.get(hexId);
        if (!unit) return;
        
        console.log('Picking up unit', unit.id, 'from hex', hexId);
        
        // Remove unit from map
        const unitDiv = document.getElementById(`unit_${hexId}`);
        if (unitDiv) unitDiv.remove();
        
        // Update state
        this.germanSetupState.placedUnits.delete(hexId);
        this.germanSetupState.availableUnits.add(unit.id);
        
        // Re-add unit to panel
        this.addUnitToPanel(unit);
        
        // Restore hex highlight
        const pos = this.hexToUnitPixelCoords(hexId);
        const highlightDiv = document.createElement('div');
        highlightDiv.className = 'german-start-hex';
        highlightDiv.id = `start_hex_${hexId}`;
        highlightDiv.style.cssText = `
            position: absolute;
            left: ${pos.x - 1}px;
            top: ${pos.y + 1}px;
            width: 44px;
            height: 44px;
            background: rgba(100, 149, 237, 0.3);
            border: 2px solid #6495ED;
            border-radius: 50%;
            pointer-events: none;
            z-index: 5;
        `;
        $('game_map').appendChild(highlightDiv);
        
        // Hide finish button if it was showing
        const finishButton = document.getElementById('finish_german_setup');
        if (finishButton) finishButton.style.display = 'none';
    }

    addUnitToPanel(unit) {
        const unitList = document.getElementById('german_unit_list');
        const fullStrengthUnits = this.GERMAN_UNITS.filter(u => u.side === 'full');
        const unitIndex = fullStrengthUnits.findIndex(u => u.id === unit.id);
        
        const unitDiv = document.createElement('div');
        unitDiv.id = `setup_unit_${unit.id}`;
        unitDiv.className = 'setup-unit';
        unitDiv.style.cssText = `cursor: pointer;`;
        
        const sprite = document.createElement('div');
        sprite.style.cssText = `
            width: ${this.UNIT_WIDTH}px;
            height: ${this.UNIT_HEIGHT}px;
            background-image: url('${this.SPRITE_SHEET}');
            background-position: -${unit.x}px -${unit.y}px;
        `;
        
        unitDiv.appendChild(sprite);
        unitDiv.addEventListener('click', () => this.onSetupUnitClick(unit));
        
        // Insert in correct position
        const existingUnits = Array.from(unitList.children);
        let inserted = false;
        for (let i = 0; i < existingUnits.length; i++) {
            const existingId = existingUnits[i].id.replace('setup_unit_', '');
            const existingIndex = fullStrengthUnits.findIndex(u => u.id === existingId);
            if (unitIndex < existingIndex) {
                unitList.insertBefore(unitDiv, existingUnits[i]);
                inserted = true;
                break;
            }
        }
        if (!inserted) {
            unitList.appendChild(unitDiv);
        }

        // Auto-select if this is the only unit left
        const remainingUnits = this.GERMAN_UNITS.filter(u => 
            u.side === 'full' && this.germanSetupState.availableUnits.has(u.id)
        );
        if (remainingUnits.length === 1) {
            this.onSetupUnitClick(unit);
        }        
    }

    onSetupUnitClick(unit) {
        console.log('Unit clicked:', unit.id);
        this.germanSetupState.selectedUnit = unit;
        
        // Visual feedback - highlight selected unit with outline (doesn't affect layout)
        document.querySelectorAll('.setup-unit').forEach(div => {
            div.style.outline = 'none';
        });
        document.getElementById(`setup_unit_${unit.id}`).style.outline = '3px solid #4CAF50';
    }

    ///////////////////////////////////////////////////
    //// Game & client states
    
    // onEnteringState: this method is called each time we are entering into a new game state.
    //                  You can use this method to perform some user interface changes at this moment.
    //
    onEnteringState( stateName, args ) {
        console.log( 'Entering state: '+stateName, args );
        
        switch( stateName ) {
        
        /* Example:
        
        case 'myGameState':
        
            // Show some HTML block at this game state
            document.getElementById('my_html_block_id').style.display = 'block';
            
            break;
        */
        
        
        case 'dummy':
            break;
        }
    }

    // onLeavingState: this method is called each time we are leaving a game state.
    //                 You can use this method to perform some user interface changes at this moment.
    //
    onLeavingState( stateName )
    {
        console.log( 'Leaving state: '+stateName );
        
        switch( stateName ) {
        
        /* Example:
        
        case 'myGameState':
        
            // Hide the HTML block we are displaying only during this game state
            document.getElementById('my_html_block_id').style.display = 'none';
            
            break;
        */
        
        
        case 'dummy':
            break;
        }               
    }

    // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
    //                        action status bar (ie: the HTML links in the status bar).
    //        
    onUpdateActionButtons( stateName, args ) {
        console.log( 'onUpdateActionButtons: '+stateName, args );
                    
        if (this.bga.gameui.isCurrentPlayerActive()) {            
            switch( stateName ) {
                // TODO

                // break;
            }
        }
    }

    ///////////////////////////////////////////////////
    //// Utility methods
    
    /*
    
        Here, you can defines some utility methods that you can use everywhere in your javascript
        script.
    
    */

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
        pixelX -= this.UNIT_WIDTH / 2 + 1;  // determines pixel location for the unit's left edge
        pixelY -= this.UNIT_HEIGHT / 2;     // determines pixel location for the unit's top edge
        
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

    positionPanelNextToMap() {
        // The main game area container
        const mapContainer = document.getElementById('game_map');
        const panel = document.getElementById('german_setup_panel');
        
        if (!mapContainer || !panel) {
            console.log('Missing mapContainer or panel element!');
            return;
        }
        
        const mapRect = mapContainer.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        panel.style.position = 'absolute';
        panel.style.top = '0'; // Align with top of game_play_area
        
        // Calculate if there's enough space to dock outside the map
        const spaceNeeded = mapRect.right + this.PANEL_GAP + this.GERMAN_SETUP_PANEL_WIDTH;
        
        if (spaceNeeded <= viewportWidth - 20) {
            console.log('Docking setup panel outside map');
            // Plenty of space - dock outside to the right
            panel.style.left = (mapRect.right + this.PANEL_GAP) + 'px';
        } else {
            console.log('Overlaying setup panel on map');
            // Tight space - overlay on right side of map
            panel.style.left = (mapRect.right - this.GERMAN_SETUP_PANEL_WIDTH - 10) + 'px';
            panel.style.boxShadow = '-2px 0 10px rgba(0,0,0,0.2)';
        }
    }

    showPhasePanel(turnNumber, phaseNumber, phaseName, message = null, canSkip = false) {
        // Remove any existing phase panel
        const existingPanel = document.getElementById('phase_panel');
        if (existingPanel) existingPanel.remove();
        
        const panelHTML = `
            <div id="phase_panel">
                <h2>Turn ${turnNumber} - Phase ${phaseNumber}</h2>
                <h3>${phaseName}</h3>
                ${message ? `<p>${message}</p>` : ''}
                <button id="phase_panel_button">${canSkip ? 'Proceed to Next Phase' : 'OK'}</button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', panelHTML);
        
        // Add click handler
        document.getElementById('phase_panel_button').addEventListener('click', () => {
            this.closePhasePanel();
            // TODO: Trigger next phase
        });
    }

    closePhasePanel() {
        const panel = document.getElementById('phase_panel');
        if (panel) panel.remove();
    }

    ///////////////////////////////////////////////////
    //// Player's action
    
    /*
    
        Here, you are defining methods to handle player's action (ex: results of mouse click on 
        game objects).
        
        Most of the time, these methods:
        _ check the action is possible at this game state.
        _ make a call to the game server
    
    */

    onMouseMove(evt) {
        const map = $('game_map');
        const rect = map.getBoundingClientRect();
        const pixelX = Math.floor(evt.clientX - rect.left);
        const pixelY = Math.floor(evt.clientY - rect.top);
        
        // Calculate column first
        const col = Math.round((pixelX - this.HEX_ORIGIN_X) / this.HEX_WIDTH) + this.HEX_ORIGIN_COL;
        
        // Adjust Y for column offset (even columns are shifted down)
        const adjustedY = (col % 2 === 0) ? pixelY - this.HEX_VERT_OFFSET : pixelY;
        
        // Calculate row
        const row = Math.round((adjustedY - this.HEX_ORIGIN_Y) / this.HEX_HEIGHT) + this.HEX_ORIGIN_ROW;
        
        // Format as 4-digit hex ID
        const hexId = (col >= 1 && col <= 14 && row >= 1 && row <= 10) 
            ? `${String(col).padStart(2, '0')}${String(row).padStart(2, '0')}`
            : '----';
        
        $('coord_display').innerHTML = `Hex: ${hexId} | Pixel: ${pixelX},${pixelY}`;
    }

    ///////////////////////////////////////////////////
    //// Reaction to cometD notifications

    /*
        setupNotifications:
        
        In this method, you associate each of your game notifications with your local method to handle it.
        
        Note: game notification names correspond to "notifyAllPlayers" and "notifyPlayer" calls in
                your battleformoscow.game.php file.
    
    */
    setupNotifications() {
        console.log( 'notifications subscriptions setup' );
        
        // automatically listen to the notifications, based on the `notif_xxx` function on this class. 
        // Uncomment the logger param to see debug information in the console about notifications.
        this.bga.notifications.setupPromiseNotifications({
            // logger: console.log
        });
    }
    
    // TODO: from this point and below, you can write your game notifications handling methods
    
    /*
    Example:
    async notif_cardPlayed( args ) {
        // Note: args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call
        
        // TODO: play the card in the user interface.
    }
    */
}

// The following unit data structure seems to capture everything we need.
// {
//     unitId: '1st_Shock',  // or whatever ID it has on the counter
//     army: 'soviet',
//     status: 'reinforcement',
//     currentSide: 'reduced',    // reinforcements arrive at reduced strength
//     arrivalTurn: 4,
    
//     hexId: null,               // not on map yet
//     startHexId: null,
    
//     hasMoved: false,
//     targetUnitId: null,
//     inSupply: null,
    
//     builtThisTurn: false,
//     upgradedThisTurn: false,
// }