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
            
        // Here, you can init the global variables of your user interface
        // Example:
        // this.myGlobalValue = 0;

        // Unit display constants
        this.UNIT_WIDTH = 44;
        this.UNIT_HEIGHT = 45;

        // Hex grid parameters
        this.HEX_WIDTH = 57;           // horizontal spacing between columns
        this.HEX_HEIGHT = 65;          // vertical spacing between rows
        this.HEX_VERT_OFFSET = 33;     // vertical offset for even columns
        this.HEX_ORIGIN_X = 38;        // pixel X of origin hex center
        this.HEX_ORIGIN_Y = 230;       // pixel Y of origin hex center
        this.HEX_ORIGIN_COL = 1;       // column number of origin hex
        this.HEX_ORIGIN_ROW = 4;       // row number of origin hex

        this.START_HEXES_SOVIET = ['0301','0302','0303','0304','0405','0504','0505','0506','0507','0508','0509','0510','0803'];
        this.START_HEXES_GERMAN = ['0103','0104','0106','0107','0201','0202','0203','0204','0205','0206','0209','0210','0305','0306','0307','0309','0310','0406','0407','0408','0409','0410'];
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
        
        // // Add coordinate display overlay
        // this.bga.gameArea.getElement().insertAdjacentHTML('beforeend', `
        //     <div id="coord_display" style="position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.7); color: white; padding: 5px; font-family: monospace; pointer-events: none; z-index: 1000;">
        //         Hex: -- | Pixel: --
        //     </div>
        // `);

        // Add coordinate display above the board
        // this.bga.gameArea.getElement().insertAdjacentHTML('beforebegin', `
        //     <div id="coord_display" style="background: rgba(0,0,0,0.7); color: white; padding: 5px; font-family: monospace; text-align: center;">
        //         Hex: -- | Pixel: --
        //     </div>
        // `);
        this.bga.gameArea.getElement().insertAdjacentHTML('beforebegin', `
            <div id="coord_display" style="display: inline-block; background: rgba(0,0,0,0.7); color: white; padding: 5px; font-family: monospace;">
                Hex: -- | Pixel: --
            </div>
        `);

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

        this.setupSovietStartingUnits();

        // Setup game notifications to handle (see "setupNotifications" method below)
        this.setupNotifications();

        // Add mousemove tracking for coordinates
        dojo.connect($('game_map'), 'mousemove', this, 'onMouseMove');

        console.log( "Ending game setup" );
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
