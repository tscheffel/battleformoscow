/**
 * UnitManager.js
 * 
 * Manages unit selection, movement, and tracking during gameplay.
 */

export class UnitManager {
    constructor(game) {
        this.game = game;
        
        this.moveHistory = [];  // Track moves for undo/reset
        this.selectedUnit = null;
        this.unitRegistry = new Map();  // Maps hexId -> unit data
        this.unitsMovedThisPhase = new Set();  // Track which units have moved
    }

    /**
     * Removes movement range highlights from the map.
     */
    clearMovementRange() {
        const highlights = document.querySelectorAll('.movement-range-hex');
        highlights.forEach(h => h.remove());
    }

    /**
     * Enables click handlers for all German units on the map.
     */
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

    /**
     * Gets all hexes that are in enemy Zone of Control.
     * @param {string} enemyFaction - 'german' or 'soviet'
     * @returns {Set<string>} Set of hex IDs in enemy ZOC
     */
    getHexesInEnemyZOC(enemyFaction) {
        const zocHexes = new Set();
        
        // Iterate through all units in the registry
        this.unitRegistry.forEach((unit, hexId) => {
            // Check if this is an enemy unit
            if (unit.faction === enemyFaction) {
                // Get all adjacent hexes (the unit's ZOC)
                const adjacentHexes = this.game.hexUtils.getAdjacentHexes(hexId);
                adjacentHexes.forEach(adjHex => zocHexes.add(adjHex));
            }
        });
        
        return zocHexes;
    }

    /**
     * Highlights a hex as a valid movement destination.
     * @param {string} hexId - Hex ID to highlight
     */
    highlightMovementHex(hexId) {
        const pos = this.game.hexUtils.hexToUnitPixelCoords(hexId);
        
        const highlightDiv = document.createElement('div');
        highlightDiv.className = 'movement-range-hex';
        highlightDiv.id = `move_${hexId}`;
        highlightDiv.style.cssText = `
            position: absolute;
            left: ${pos.x - 1}px;
            top: ${pos.y + 1}px;
            width: ${this.game.UNIT_WIDTH}px;
            height: ${this.game.UNIT_HEIGHT}px;
            background: rgba(50, 205, 50, 0.4);
            border: 2px solid #32CD32;
            border-radius: 50%;
            pointer-events: auto;
            cursor: pointer;
            z-index: 5;
        `;
        
        // Add click handler for movement
        highlightDiv.addEventListener('click', (evt) => {
            evt.stopPropagation();
            this.moveUnitToHex(hexId);
        });
        
        $('game_map').appendChild(highlightDiv);
    }

    /**
     * Checks if a hex is currently occupied by any unit.
     * @param {string} hexId - Hex ID to check
     * @returns {boolean} True if hex is occupied
     */
    isHexOccupied(hexId) {
        return this.unitRegistry.has(hexId);
    }

    /**
     * Checks if a hex is occupied by an enemy unit.
     * @param {string} hexId - Hex ID to check
     * @param {string} friendlySide - 'german' or 'soviet'
     * @returns {boolean} True if hex has an enemy unit
     */
    isHexOccupiedByEnemy(hexId, friendlySide) {
        const unit = this.unitRegistry.get(hexId);
        if (!unit) return false;
        return unit.faction !== friendlySide;
    }

    /**
     * Moves the selected unit to the specified hex.
     * @param {string} targetHexId - Destination hex ID
     */
    moveUnitToHex(targetHexId) {
        if (!this.selectedUnit) {
            console.log('No unit selected');
            return;
        }
        
        // Check if target hex is occupied by a friendly unit
        if (this.isHexOccupied(targetHexId)) {
            console.log('Cannot move - hex is occupied');
            return;
        }        

        const { hexId: sourceHexId, div: unitDiv, unit } = this.selectedUnit;

        // Record move in history for undo
        this.moveHistory.push({
            unit: unit,
            fromHexId: sourceHexId,
            toHexId: targetHexId
        });        
        
        console.log(`Moving unit from ${sourceHexId} to ${targetHexId}`);
        
        // Get new position
        const newPos = this.game.hexUtils.hexToUnitPixelCoords(targetHexId);
        
        // Update unit div position
        unitDiv.style.left = newPos.x + 'px';
        unitDiv.style.top = newPos.y + 'px';
        unitDiv.id = `unit_${targetHexId}`;
        
        // Update registry
        this.unitRegistry.delete(sourceHexId);
        this.unitRegistry.set(targetHexId, unit);
        
        // Track that this unit moved this phase
        this.unitsMovedThisPhase.add(targetHexId);
        
        // Add visual indicator that unit has moved: blue tint (via filter) and checkmark badge (for accessibility)
        unitDiv.style.filter = 'sepia(20%) hue-rotate(180deg) saturate(70%)';

        // Add a small checkmark badge (visible to colorblind users)
        const movedBadge = document.createElement('div');
        movedBadge.className = 'moved-badge';
        movedBadge.style.cssText = `
            position: absolute;
            top: -2px;
            left: -2px;
            width: 14px;
            height: 14px;
            background: white;
            border: 2px solid black;
            border-radius: 50%;
            font-size: 10px;
            line-height: 10px;
            text-align: center;
            font-weight: bold;
            z-index: 20;
        `;
        movedBadge.textContent = '✓';
        unitDiv.appendChild(movedBadge);

        // Clear selection and movement range
        unitDiv.style.outline = 'none';
        this.clearMovementRange();
        this.selectedUnit = null;

        // Update undo button state
        this.updateUndoButton();
        this.updateResetButton();
        
        console.log('Unit moved successfully');
    }

    /**
     * Handles unit click events and validates if the unit can move.
     * @param {HTMLElement} unitDiv - The clicked unit div element
     */
    onUnitClick(unitDiv) {
        const hexId = unitDiv.id.replace('unit_', '');
        const unit = this.unitRegistry.get(hexId);
    
        if (!unit) {
            console.log('Unit data not found for hex:', hexId);
            return;
        }

        console.log('Unit clicked:', unit.id, 'Type:', unit.type, 'at hex:', hexId);

        // Check if unit can move in current phase
        if (this.game.phaseManager.currentPhase === 2) {
            // German Panzer Movement Phase - only armor can move
            if (unit.type !== 'armor') {
                console.log('Only panzers can move in Phase 2');
                return;
            }
        }
        
        // Check if unit already moved this phase (except panzers in phase 4)
        if (this.unitsMovedThisPhase.has(hexId) && this.game.phaseManager.currentPhase !== 4) {
            console.log('Unit already moved this phase');
            return;
        }
        
        // Select the unit
        this.selectUnit(unitDiv, hexId, unit);
    }

    /**
     * Resets all moves made during the current phase.
     */
    resetAllMoves() {
        if (this.moveHistory.length === 0) {
            console.log('No moves to reset');
            return;
        }
        
        console.log(`Resetting ${this.moveHistory.length} moves`);
        
        // Deselect any currently selected unit
        if (this.selectedUnit) {
            this.selectedUnit.div.style.outline = 'none';
            this.clearMovementRange();
            this.selectedUnit = null;
        }
        
        // Undo all moves in reverse order
        while (this.moveHistory.length > 0) {
            const move = this.moveHistory.pop();
            const { unit, fromHexId, toHexId } = move;
            
            // Get unit div
            const unitDiv = document.getElementById(`unit_${toHexId}`);
            if (!unitDiv) {
                console.error('Unit div not found for', toHexId);
                continue;
            }
            
            // Get original position
            const originalPos = this.game.hexUtils.hexToUnitPixelCoords(fromHexId);
            
            // Move unit back
            unitDiv.style.left = originalPos.x + 'px';
            unitDiv.style.top = originalPos.y + 'px';
            unitDiv.id = `unit_${fromHexId}`;
            
            // Restore visual state
            unitDiv.style.filter = 'none';
            
            // Remove moved badge
            const badge = unitDiv.querySelector('.moved-badge');
            if (badge) badge.remove();
            
            // Update registry
            this.unitRegistry.delete(toHexId);
            this.unitRegistry.set(fromHexId, unit);
        }
        
        // Clear moved units tracking
        this.unitsMovedThisPhase.clear();
        
        console.log('All moves reset');
        
        // Update button states
        this.updateUndoButton();
        this.updateResetButton();
    }

    /**
     * Selects a unit and displays its movement range.
     * @param {HTMLElement} unitDiv - The unit div element
     * @param {string} hexId - Hex ID where the unit is located
     * @param {Object} unit - Unit data object
     */
    selectUnit(unitDiv, hexId, unit) {
        // If clicking the already-selected unit, deselect it
        if (this.selectedUnit && this.selectedUnit.hexId === hexId) {
            this.selectedUnit.div.style.outline = 'none';
            this.clearMovementRange();
            this.selectedUnit = null;
            console.log('Unit deselected');
            return;
        }

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

    /**
     * Calculates and displays valid movement hexes for the selected unit.
     * @param {string} hexId - Starting hex ID
     * @param {Object} unit - Unit data object with movement allowance
     */
    showMovementRange(hexId, unit) {
        console.log('Calculating movement range for hex:', hexId, 'Unit:', unit.id, 'Movement:', unit.movement);
        
        // Get enemy ZOC hexes
        const enemyFaction = unit.faction === 'german' ? 'soviet' : 'german';
        const enemyZOC = this.getHexesInEnemyZOC(enemyFaction);
        
        // Track hexes we can reach with remaining movement points
        const reachable = new Map(); // hexId -> movement points remaining
        const queue = [{ hexId, movementLeft: unit.movement }];
        reachable.set(hexId, unit.movement); // Starting hex
        
        while (queue.length > 0) {
            const current = queue.shift();
            
            // Get adjacent hexes
            const neighbors = this.game.hexUtils.getAdjacentHexes(current.hexId);
            
            for (const neighborId of neighbors) {
                // Skip if already visited with more movement
                if (reachable.has(neighborId) && reachable.get(neighborId) >= current.movementLeft) {
                    continue;
                }
                
                // Check if hex is occupied by enemy
                if (this.isHexOccupiedByEnemy(neighborId, unit.faction)) {
                    continue; // Can't enter enemy-occupied hexes
                }
                
                // Calculate movement cost
                const terrain = this.game.mapData.HEX_DATA[neighborId]?.terrain || 'clear';
                const moveCost = terrain === 'forest' ? 2 : 1;
                const movementLeft = current.movementLeft - moveCost;
                
                // Check if we have enough movement
                if (movementLeft < 0) {
                    continue;
                }
                
                // Can reach this hex
                reachable.set(neighborId, movementLeft);

                // Only highlight if not already highlighted
                if (!document.getElementById(`move_${neighborId}`)) {
                    this.highlightMovementHex(neighborId);
                }

                // If entering enemy ZOC, stop expanding from this hex
                if (enemyZOC.has(neighborId)) {
                    continue;
                }

                // Add to queue for further exploration
                queue.push({ hexId: neighborId, movementLeft });
            }
        }
        
        console.log(`Can reach ${reachable.size} hexes`);
    }

    /**
     * Undoes the last move made during the current phase.
     */
    undoLastMove() {
        if (this.moveHistory.length === 0) {
            console.log('No moves to undo');
            return;
        }
        
        // Deselect any currently selected unit
        if (this.selectedUnit) {
            this.selectedUnit.div.style.outline = 'none';
            this.clearMovementRange();
            this.selectedUnit = null;
        }

        // Get last move
        const lastMove = this.moveHistory.pop();
        const { unit, fromHexId, toHexId } = lastMove;
        
        console.log(`Undoing move from ${fromHexId} to ${toHexId}`);
        
        // Get unit div
        const unitDiv = document.getElementById(`unit_${toHexId}`);
        if (!unitDiv) {
            console.error('Unit div not found');
            return;
        }
        
        // Get original position
        const originalPos = this.game.hexUtils.hexToUnitPixelCoords(fromHexId);
        
        // Move unit back
        unitDiv.style.left = originalPos.x + 'px';
        unitDiv.style.top = originalPos.y + 'px';
        unitDiv.id = `unit_${fromHexId}`;
        
        // Restore visual state (remove "moved" indicator)
        unitDiv.style.filter = 'none';
        
        // Remove moved badge
        const badge = unitDiv.querySelector('.moved-badge');
        if (badge) badge.remove();

        // Update registry
        this.unitRegistry.delete(toHexId);
        this.unitRegistry.set(fromHexId, unit);
        
        // Remove from moved units
        this.unitsMovedThisPhase.delete(toHexId);
        
        console.log('Move undone');
        
        // Enable/disable undo button based on remaining moves
        this.updateUndoButton();
        this.updateResetButton();
    }

    /**
     * Updates the reset button enabled/disabled state.
     */
    updateResetButton() {
        const resetBtn = document.getElementById('reset_moves_button');
        if (resetBtn) {
            resetBtn.disabled = this.moveHistory.length === 0;
        }
    }

    /**
     * Updates the undo button enabled/disabled state.
     */
    updateUndoButton() {
        const undoBtn = document.getElementById('undo_move_button');
        if (undoBtn) {
            undoBtn.disabled = this.moveHistory.length === 0;
        }
    }    
}