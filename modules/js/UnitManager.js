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
        // TODO: Remove movement range highlights
        console.log('Clearing movement range');
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
     * Selects a unit and displays its movement range.
     * @param {HTMLElement} unitDiv - The unit div element
     * @param {string} hexId - Hex ID where the unit is located
     * @param {Object} unit - Unit data object
     */
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

    /**
     * Calculates and displays valid movement hexes for the selected unit.
     * @param {string} hexId - Starting hex ID
     * @param {Object} unit - Unit data object with movement allowance
     */
    showMovementRange(hexId, unit) {
        // TODO: Calculate and display valid movement hexes
        console.log('Showing movement range for hex:', hexId, 'Unit:', unit.id, 'Movement:', unit.movement);
    }
}