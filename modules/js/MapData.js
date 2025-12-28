/**
 * MapData.js
 * 
 * Contains all static map data and helper methods for querying hex properties.
 */

export class MapData {
    constructor() {

        this.START_HEXES_SOVIET = ['0301','0302','0303','0304','0405','0504','0505','0506','0507','0508','0509','0510','0803'];
        this.START_HEXES_GERMAN = ['0103','0104','0106','0107','0201','0202','0203','0204','0205','0206','0209','0210','0305','0306','0307','0309','0310','0406','0407','0408','0409','0410'];

        this.HEX_DATA = {
            "0101": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0102": {"terrain":"clear","city":null,"setupSide":null,"rail":["NE","NW"],"road":[],"river":[]},
            "0103": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0104": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0105": {"terrain":"clear","city":null,"setupSide":null,"rail":["NE","NW"],"road":[],"river":["SE","S"]},
            "0106": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":["N"]},
            "0107": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0108": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0109": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0110": {"terrain":"clear","city":null,"setupSide":null,"rail":["NE","NW"],"road":[],"river":[]},
            "0201": {"terrain":"forest","city":null,"setupSide":null,"rail":["SE","SW"],"road":[],"river":[]},
            "0202": {"terrain":"forest","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0203": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0204": {"terrain":"clear","city":"small","setupSide":null,"rail":["SE","SW"],"road":[],"river":["S"]},
            "0205": {"terrain":"clear","city":null,"setupSide":null,"rail":["N","SE"],"road":[],"river":["N","NE","NW"]},
            "0206": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0207": {"terrain":"forest","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0208": {"terrain":"forest","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0209": {"terrain":"clear","city":null,"setupSide":null,"rail":["SE","SW"],"road":[],"river":[]},
            "0210": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0301": {"terrain":"forest","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0302": {"terrain":"clear","city":null,"setupSide":null,"rail":["SE","SW"],"road":[],"river":[]},
            "0303": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0304": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0305": {"terrain":"clear","city":null,"setupSide":null,"rail":["NE","NW"],"road":[],"river":["SE","S","SW"]},
            "0306": {"terrain":"clear","city":null,"setupSide":null,"rail":["S","NW"],"road":[],"river":["N"]},
            "0307": {"terrain":"clear","city":"small","setupSide":null,"rail":["N","SE"],"road":[],"river":[]},
            "0308": {"terrain":"forest","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0309": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0310": {"terrain":"clear","city":null,"setupSide":null,"rail":["NE","NW"],"road":[],"river":[]},
            "0401": {"terrain":"forest","city":null,"setupSide":null,"rail":["SE","SW"],"road":[],"river":[]},
            "0402": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0403": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":["SE"]},
            "0404": {"terrain":"clear","city":null,"setupSide":null,"rail":["NE","SW"],"road":[],"river":["NE","SE","S"]},
            "0405": {"terrain":"forest","city":null,"setupSide":null,"rail":[],"road":[],"river":["N","NW"]},
            "0406": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0407": {"terrain":"clear","city":null,"setupSide":null,"rail":["SE","NW"],"road":[],"river":[]},
            "0408": {"terrain":"forest","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0409": {"terrain":"forest","city":null,"setupSide":null,"rail":["NE","SW"],"road":[],"river":[]},
            "0410": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0501": {"terrain":"fort","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0502": {"terrain":"fort","city":null,"setupSide":null,"rail":["NE","NW"],"road":[],"river":[]},
            "0503": {"terrain":"fort","city":null,"setupSide":null,"rail":[],"road":[],"river":["SE","S"]},
            "0504": {"terrain":"fort","city":null,"setupSide":null,"rail":["NE","SW"],"road":[],"river":["N","SE","SW","NW"]},
            "0505": {"terrain":"fort","city":null,"setupSide":null,"rail":[],"road":[],"river":["NE","SE","S","NW"]},
            "0506": {"terrain":"fort","city":null,"setupSide":null,"rail":[],"road":[],"river":["N"]},
            "0507": {"terrain":"fort","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0508": {"terrain":"clear","city":null,"setupSide":null,"rail":["S","NW"],"road":[],"river":[]},
            "0509": {"terrain":"clear","city":"small","setupSide":null,"rail":["NE","SE","S","SW"],"road":[],"river":[]},
            "0510": {"terrain":"forest","city":null,"setupSide":null,"rail":["N","S"],"road":[],"river":[]},
            "0601": {"terrain":"clear","city":"small","setupSide":null,"rail":["SE","S","SW"],"road":[],"river":[]},
            "0602": {"terrain":"clear","city":null,"setupSide":null,"rail":["N","S"],"road":[],"river":[]},
            "0603": {"terrain":"clear","city":"small","setupSide":null,"rail":["N","SE","SW"],"road":[],"river":["S","NW"]},
            "0604": {"terrain":"forest","city":null,"setupSide":null,"rail":[],"road":[],"river":["N","NE","SE","SW","NW"]},
            "0605": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":["NE","NW"]},
            "0606": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0607": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0608": {"terrain":"clear","city":null,"setupSide":null,"rail":["NE","SW"],"road":[],"river":[]},
            "0609": {"terrain":"clear","city":null,"setupSide":null,"rail":["SE","NW"],"road":[],"river":[]},
            "0610": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0701": {"terrain":"forest","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0702": {"terrain":"forest","city":null,"setupSide":null,"rail":["SE","NW"],"road":[],"river":[]},
            "0703": {"terrain":"forest","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0704": {"terrain":"forest","city":null,"setupSide":null,"rail":["NE","NW"],"road":[],"river":["SW"]},
            "0705": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":["S","SW","NW"]},
            "0706": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":["N","NE"]},
            "0707": {"terrain":"clear","city":null,"setupSide":null,"rail":["NE","S"],"road":[],"river":[]},
            "0708": {"terrain":"forest","city":null,"setupSide":null,"rail":["N","SW"],"road":[],"river":[]},
            "0709": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0710": {"terrain":"clear","city":null,"setupSide":null,"rail":["NE","NW"],"road":[],"river":[]},
            "0801": {"terrain":"fort","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0802": {"terrain":"fort","city":null,"setupSide":null,"rail":["SE","NW"],"road":[],"river":[]},
            "0803": {"terrain":"fort","city":"small","setupSide":null,"rail":["NE","SW"],"road":[],"river":[]},
            "0804": {"terrain":"fort","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0805": {"terrain":"fort","city":"small","setupSide":null,"rail":["NE","S"],"road":[],"river":["S","SW"]},
            "0806": {"terrain":"forest","city":null,"setupSide":null,"rail":["N","SW"],"road":[],"river":["N","NE","SE"]},
            "0807": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":["NE","SE"]},
            "0808": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":["NE"]},
            "0809": {"terrain":"clear","city":"small","setupSide":null,"rail":["NE","S","SW"],"road":[],"river":[]},
            "0810": {"terrain":"clear","city":null,"setupSide":null,"rail":["N","S"],"road":[],"river":[]},
            "0901": {"terrain":"forest","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0902": {"terrain":"forest","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0903": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "0904": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":["S"]},
            "0905": {"terrain":"forest","city":null,"setupSide":null,"rail":[],"road":[],"river":["N","NE"]},
            "0906": {"terrain":"forest","city":null,"setupSide":null,"rail":[],"road":[],"river":["SE","S","SW"]},
            "0907": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":["N","SW","NW"]},
            "0908": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":["S","SW","NW"]},
            "0909": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":["N","NE","SE"]},
            "0910": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":["NE","SE"]},
            "1001": {"terrain":"fort","city":null,"setupSide":null,"rail":[],"road":[],"river":["NE","SE"]},
            "1002": {"terrain":"fort","city":null,"setupSide":null,"rail":[],"road":[],"river":["NE","SE"]},
            "1003": {"terrain":"fort","city":null,"setupSide":null,"rail":[],"road":[],"river":["NE"]},
            "1004": {"terrain":"fort","city":null,"setupSide":null,"rail":[],"road":[],"river":["S","SW"]},
            "1005": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":["N","NE","SE","S"]},
            "1006": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":["N","NW"]},
            "1007": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "1008": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":["SW"]},
            "1009": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":["SW","NW"]},
            "1010": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":["NW"]},
            "1101": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":["SW"]},
            "1102": {"terrain":"fort","city":null,"setupSide":null,"rail":[],"road":[],"river":["SW","NW"]},
            "1103": {"terrain":"clear","city":"moscow","setupSide":null,"rail":[],"road":[],"river":["S","SW","NW"]},
            "1104": {"terrain":"fort","city":null,"setupSide":null,"rail":[],"road":[],"river":["N","NE"]},
            "1105": {"terrain":"fort","city":null,"setupSide":null,"rail":[],"road":[],"river":["SE","S","SW"]},
            "1106": {"terrain":"fort","city":null,"setupSide":null,"rail":[],"road":[],"river":["N","NW"]},
            "1107": {"terrain":"fort","city":"small","setupSide":null,"rail":[],"road":[],"river":[]},
            "1108": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "1109": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "1110": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "1201": {"terrain":"forest","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "1202": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "1203": {"terrain":"fort","city":null,"setupSide":null,"rail":[],"road":[],"river":["S","SW"]},
            "1204": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":["N","NE","SE","S"]},
            "1205": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":["N","NW"]},
            "1206": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "1207": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "1208": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "1209": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "1210": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "1301": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "1302": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "1303": {"terrain":"forest","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "1304": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":["S","SW"]},
            "1305": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":["N","NE","NW"]},
            "1306": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "1307": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "1308": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "1309": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "1310": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "1401": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "1402": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "1403": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "1404": {"terrain":"forest","city":null,"setupSide":null,"rail":[],"road":[],"river":["S","SW"]},
            "1405": {"terrain":"clear","city":"small","setupSide":null,"rail":[],"road":[],"river":["N","NE"]},
            "1406": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "1407": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "1408": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "1409": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]},
            "1410": {"terrain":"clear","city":null,"setupSide":null,"rail":[],"road":[],"river":[]}
        };

        // Populate setupSide based on starting hex arrays
        this.START_HEXES_GERMAN.forEach(hexId => {
            if (this.HEX_DATA[hexId]) {
                this.HEX_DATA[hexId].setupSide = 'german';
            }
        });

        this.START_HEXES_SOVIET.forEach(hexId => {
            if (this.HEX_DATA[hexId]) {
                this.HEX_DATA[hexId].setupSide = 'soviet';
            }
        });
    }

    /**
     * Validates that river hexsides are symmetrical.
     * @returns {Object} { valid: boolean, errors: string[], checked: number }
     */
    validateRiverData() {
        const oppositeDir = {
            'N': 'S',
            'NE': 'SW',
            'SE': 'NW',
            'S': 'N',
            'SW': 'NE',
            'NW': 'SE'
        };

        // Helper to get adjacent hex in a specific direction
        const getAdjacentHexInDirection = (hexId, direction) => {
            const col = parseInt(hexId.substring(0, 2));
            const row = parseInt(hexId.substring(2, 4));
            const isEvenCol = (col % 2 === 0);

            const offsets = isEvenCol ? {
                'N':  { dcol: 0,  drow: -1 },
                'NE': { dcol: 1,  drow: 0 },
                'SE': { dcol: 1,  drow: 1 },
                'S':  { dcol: 0,  drow: 1 },
                'SW': { dcol: -1, drow: 1 },
                'NW': { dcol: -1, drow: 0 }
            } : {
                'N':  { dcol: 0,  drow: -1 },
                'NE': { dcol: 1,  drow: -1 },
                'SE': { dcol: 1,  drow: 0 },
                'S':  { dcol: 0,  drow: 1 },
                'SW': { dcol: -1, drow: 0 },
                'NW': { dcol: -1, drow: -1 }
            };

            const offset = offsets[direction];
            if (!offset) return null;

            const newCol = col + offset.dcol;
            const newRow = row + offset.drow;

            // Check bounds (map is 1-14 columns, 1-10 rows)
            if (newCol < 1 || newCol > 14 || newRow < 1 || newRow > 10) {
                return null; // Edge of map
            }

            return String(newCol).padStart(2, '0') + String(newRow).padStart(2, '0');
        };

        const errors = [];
        let checked = 0;

        for (const [hexId, hexData] of Object.entries(this.HEX_DATA)) {
            const rivers = hexData.river || [];

            for (const direction of rivers) {
                checked++;
                const neighborHexId = getAdjacentHexInDirection(hexId, direction);

                if (!neighborHexId) {
                    continue; // Map edge - ok
                }

                const neighborHex = this.HEX_DATA[neighborHexId];
                if (!neighborHex) {
                    errors.push(`${hexId} river on ${direction} → hex ${neighborHexId} doesn't exist!`);
                    continue;
                }

                const expectedOppositeDir = oppositeDir[direction];
                const neighborRivers = neighborHex.river || [];

                if (!neighborRivers.includes(expectedOppositeDir)) {
                    errors.push(`${hexId} has river on ${direction}, but ${neighborHexId} is missing river on ${expectedOppositeDir}`);
                }
            }
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            checked: checked
        };
    }
}