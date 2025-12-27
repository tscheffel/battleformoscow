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

import { HexUtils } from './HexUtils.js';
import { MapData } from './MapData.js';
import { PhaseManager } from './PhaseManager.js';
import { SetupManager } from './SetupManager.js';
import { UnitData } from './UnitData.js';
import { UnitManager } from './UnitManager.js';

export class Game {
    constructor(bga) {
        console.log('battleformoscow constructor');
        this.bga = bga;
            
        // Initialize mapData FIRST
        this.hexUtils = new HexUtils(this);
        this.mapData = new MapData();
        this.phaseManager = new PhaseManager(this);
        this.setupManager = new SetupManager(this);
        this.unitManager = new UnitManager(this);
        this.unitData = new UnitData();

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
        this.phaseManager.currentTurn = gamedatas.gamestate.turn || 1;
        this.phaseManager.currentPhase = gamedatas.gamestate.phase || 1;
        this.phaseManager.activePlayer = gamedatas.gamestate.active_player;

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
        dojo.connect($('game_map'), 'click', this.setupManager, 'onMapClick');

        console.log( "Setting up Soviet units" );
        this.setupSovietStartingUnits();
        console.log( "Setting up German units" );
        this.setupManager.setupGermanUnits();

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
        const sortedKeys = Object.keys(this.mapData.HEX_DATA)
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
            const value = JSON.stringify(this.mapData.HEX_DATA[key]);
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
        this.mapData.START_HEXES_SOVIET.forEach(hexId => {
            const pos = this.hexUtils.hexToUnitPixelCoords(hexId);
            
            const unitDiv = document.createElement('div');
            unitDiv.className = 'unit soviet-infantry';  // Use the CSS class
            unitDiv.id = `unit_${hexId}`;
            unitDiv.style.left = pos.x + 'px';
            unitDiv.style.top = pos.y + 'px';
            
            $('game_map').appendChild(unitDiv);
        });
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