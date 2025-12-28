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
            
        // Initialize modules
        this.hexUtils = new HexUtils(this);
        this.mapData = new MapData();
        this.phaseManager = new PhaseManager(this);
        this.setupManager = new SetupManager(this);
        this.unitManager = new UnitManager(this);
        this.unitData = new UnitData();

        // Expose for debugging
        window.das_game = this;

        // Image file paths
        this.SPRITE_SHEET = `${g_gamethemeurl}img/units_initial_exported.png`;
        this.MAP_IMAGE = `${g_gamethemeurl}img/game_map_second_source_cropped.png`;  // Update with actual map filename

        // Unit display constants
        this.UNIT_WIDTH = 44;
        this.UNIT_HEIGHT = 44;

        // Validate river data on startup
        const validation = this.mapData.validateRiverData();
        if (!validation.valid) {
            console.error('❌ RIVER DATA ERRORS FOUND:');
            validation.errors.forEach(e => console.error('  ' + e));
            alert(`River data is not valid!\n\n${validation.errors.length} error(s) found.\n\nCheck console for details.`);
        } else {
            console.log(`✅ River data validated: ${validation.checked} hexsides checked, all symmetrical`);
        }
    }
    
    /*
        setup:
        
        This method must set up the game user interface according to current game situation specified in parameters.
        
        The method is called each time the game interface is displayed to a player, e.g.
            - When the game starts
            - When a player refreshes the game page (F5)
        
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
        this.setupManager.setupSovietStartingUnits();
        console.log( "Setting up German units" );
        this.setupManager.showGermanSetupPanel();

        console.log( "Ending game setup" );
    }

    ///////////////////////////////////////////////////
    //// Game & client states
    ///////////////////////////////////////////////////
    
    // This method is called each time we are entering into a new game state. You can use this method to perform some user interface changes at this moment.
    onEnteringState( stateName, args ) {
        console.log( 'Entering state: '+stateName, args );
        
        switch( stateName ) {
            case 'dummy':
                break;
        }
    }

    // This method is called each time we are leaving a game state. You can use this method to perform some user interface changes at this moment.
    onLeavingState( stateName )
    {
        console.log( 'Leaving state: '+stateName );
        
        switch( stateName ) {
            case 'dummy':
                break;
        }               
    }

    // Manage "action buttons" that are displayed in the action status bar (ie: the HTML links in the status bar).
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
    //// Player action
    ///////////////////////////////////////////////////

    onMouseMove(evt) {
        const map = $('game_map');
        const rect = map.getBoundingClientRect();
        const pixelX = Math.floor(evt.clientX - rect.left);
        const pixelY = Math.floor(evt.clientY - rect.top);
        
        // Calculate column first
        const col = Math.round((pixelX - this.hexUtils.HEX_ORIGIN_X) / this.hexUtils.HEX_WIDTH) + this.hexUtils.HEX_ORIGIN_COL;
        
        // Adjust Y for column offset (even columns are shifted down)
        const adjustedY = (col % 2 === 0) ? pixelY - this.hexUtils.HEX_VERT_OFFSET : pixelY;
        
        // Calculate row
        const row = Math.round((adjustedY - this.hexUtils.HEX_ORIGIN_Y) / this.hexUtils.HEX_HEIGHT) + this.hexUtils.HEX_ORIGIN_ROW;
        
        // Format as 4-digit hex ID
        const hexId = (col >= 1 && col <= 14 && row >= 1 && row <= 10) 
            ? `${String(col).padStart(2, '0')}${String(row).padStart(2, '0')}`
            : '----';
        
        $('coord_display').innerHTML = `Hex: ${hexId} | Pixel: ${pixelX},${pixelY}`;
    }

    ///////////////////////////////////////////////////
    //// Notifications
    ///////////////////////////////////////////////////

    setupNotifications() {
        console.log( 'notifications subscriptions setup' );
        
        // automatically listen to the notifications, based on the `notif_xxx` function on this class. 
        // Uncomment the logger param to see debug information in the console about notifications.
        this.bga.notifications.setupPromiseNotifications({
            // logger: console.log
        });
    }
    
    // TODO: from this point and below, you can write your game notifications handling methods
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