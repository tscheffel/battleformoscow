/**
 * SetupManager.js
 * 
 * Manages the German unit setup phase including panel UI and unit placement.
 */

export class SetupManager {
    constructor(game) {
        this.game = game;
        
        this.germanSetupState = null;
        this.resizeHandler = null;
        this.finishSetupHandlerAdded = false;

        // Panel layout constants
        this.PANEL_GAP = 5;                   // Gap in pixels between map and setup panel
        this.GERMAN_SETUP_PANEL_WIDTH = 300;  // panel width in pixels
    }

    // CUT these methods from Game.js and paste here:
    // - addUnitToPanel()
    // - autoPlaceGermanUnits()
    // - checkGermanSetupComplete()
    // - clearGermanStartingHexHighlights()
    // - closeGermanSetupPanel()
    // - finishGermanSetup()
    // - highlightGermanStartingHexes()
    // - onMapClick()
    // - onSetupUnitClick()
    // - pickupGermanUnit()
    // - placeGermanUnit()
    // - populateGermanUnitPanel()
    // - positionPanelNextToMap()
    // - setupGermanUnits()
    // - setupSovietStartingUnits()

    addUnitToPanel(unit) {
        const unitList = document.getElementById('german_unit_list');
        const fullStrengthUnits = this.game.unitData.GERMAN_UNITS.filter(u => u.side === 'full');
        const unitIndex = fullStrengthUnits.findIndex(u => u.id === unit.id);
        
        const unitDiv = document.createElement('div');
        unitDiv.id = `setup_unit_${unit.id}`;
        unitDiv.className = 'setup-unit';
        unitDiv.style.cssText = `cursor: pointer;`;
        
        const sprite = document.createElement('div');
        sprite.style.cssText = `
            width: ${this.game.UNIT_WIDTH}px;
            height: ${this.game.UNIT_HEIGHT}px;
            background-image: url('${this.game.SPRITE_SHEET}');
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
        const remainingUnits = this.game.unitData.GERMAN_UNITS.filter(u => 
            u.side === 'full' && this.germanSetupState.availableUnits.has(u.id)
        );
        if (remainingUnits.length === 1) {
            this.onSetupUnitClick(unit);
        }        
    }

    autoPlaceGermanUnits() {
        // Get all full strength units that are still available
        const fullStrengthUnits = this.game.unitData.GERMAN_UNITS.filter(u => 
            u.side === 'full' && this.germanSetupState.availableUnits.has(u.id)
        );
        
        // Get available starting hexes (not occupied)
        const availableHexes = this.game.mapData.START_HEXES_GERMAN.filter(hexId =>
            !this.germanSetupState.placedUnits.has(hexId)
        );
        
        // Place each available unit on an available hex
        fullStrengthUnits.forEach((unit, index) => {
            if (index < availableHexes.length) {
                this.placeGermanUnit(unit, availableHexes[index]);
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
                
                // Only add handler if not already added
                if (!this.finishSetupHandlerAdded) {
                    finishButton.addEventListener('click', () => this.finishGermanSetup());
                    this.finishSetupHandlerAdded = true;
                }
            }
        }
    }

    clearGermanStartingHexHighlights() {
       this.game.mapData.START_HEXES_GERMAN.forEach(hexId => {
           const highlight = document.getElementById(`start_hex_${hexId}`);
           if (highlight) highlight.remove();
       });
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

    finishGermanSetup() {
        console.log('Finishing German setup...');

        // Remove click handlers from all placed German units
        this.germanSetupState.placedUnits.forEach((unit, hexId) => {
            this.game.unitManager.unitRegistry.set(hexId, unit);

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
        this.game.phaseManager.showPhaseControlPanel();
        
        // Show phase 1 notification
        this.game.phaseManager.showPhasePanel(
            this.game.phaseManager.currentTurn, 
            this.game.phaseManager.currentPhase, 
            this.game.phaseManager.PHASES[this.game.phaseManager.currentPhase].name, 
            'No German replacements on Turn 1. This phase is skipped.', 
            true
        );

        // Enable unit selection for gameplay
        this.game.unitManager.enableUnitSelection();
    }

    highlightGermanStartingHexes() {
        this.game.mapData.START_HEXES_GERMAN.forEach(hexId => {
            const pos = this.game.hexUtils.hexToUnitPixelCoords(hexId);
            
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
        const hexId = this.game.hexUtils.pixelToHexId(pixelX, pixelY);
        if (!hexId) return;
        
        // Check if this is a valid starting hex
        if (!this.game.mapData.START_HEXES_GERMAN.includes(hexId)) {
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

    onSetupUnitClick(unit) {
        console.log('Unit clicked:', unit.id);
        this.germanSetupState.selectedUnit = unit;
        
        // Visual feedback - highlight selected unit with outline (doesn't affect layout)
        document.querySelectorAll('.setup-unit').forEach(div => {
            div.style.outline = 'none';
        });
        document.getElementById(`setup_unit_${unit.id}`).style.outline = '3px solid #4CAF50';
    }

    pickupGermanUnit(hexId) {
        // Only allow pickup during setup
        if (!this.germanSetupState) {
            console.log('Cannot pickup unit - setup is complete');
            return;
        }

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
        const pos = this.game.hexUtils.hexToUnitPixelCoords(hexId);
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

    placeGermanUnit(unit, hexId) {
        console.log('Placing unit', unit.id, 'on hex', hexId);
        
        // Get position for the unit
        const pos = this.game.hexUtils.hexToUnitPixelCoords(hexId);
        
        // Create unit div on the map
        const unitDiv = document.createElement('div');
        unitDiv.className = 'unit german-unit';
        unitDiv.id = `unit_${hexId}`;
        unitDiv.style.cssText = `
            position: absolute;
            left: ${pos.x}px;
            top: ${pos.y}px;
            width: ${this.game.UNIT_WIDTH}px;
            height: ${this.game.UNIT_HEIGHT}px;
            background-image: url('${this.game.SPRITE_SHEET}');
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
        const fullStrengthUnits = this.game.unitData.GERMAN_UNITS.filter(u => u.side === 'full');
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

    populateGermanUnitPanel() {
        const unitList = document.getElementById('german_unit_list');
        
        // Get only full strength German units (no reduced sides)
        const fullStrengthUnits = this.game.unitData.GERMAN_UNITS.filter(u => u.side === 'full');
        
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
                width: ${this.game.UNIT_WIDTH}px;
                height: ${this.game.UNIT_HEIGHT}px;
                background-image: url('${this.game.SPRITE_SHEET}');
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

    setupSovietStartingUnits() {
        this.game.mapData.START_HEXES_SOVIET.forEach(hexId => {
            const pos = this.game.hexUtils.hexToUnitPixelCoords(hexId);
            
            const unitDiv = document.createElement('div');
            unitDiv.className = 'unit soviet-infantry';  // Use the CSS class
            unitDiv.id = `unit_${hexId}`;
            unitDiv.style.left = pos.x + 'px';
            unitDiv.style.top = pos.y + 'px';
            
            $('game_map').appendChild(unitDiv);
        });
    }
}