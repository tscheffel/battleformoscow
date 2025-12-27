/**
 * PhaseManager.js
 * 
 * Manages game phases, turn tracking, and phase-related UI panels.
 */

export class PhaseManager {
    constructor(game) {
        this.game = game;
        
        this.MAX_PHASE = 8;

        // Game state tracking
        this.currentTurn = 1;
        this.currentPhase = 1;
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
    }

    /**
     * Closes the phase notification panel.
     */
    closePhasePanel() {
        const panel = document.getElementById('phase_panel');
        if (panel) panel.remove();
    }

    /**
     * Ends the current phase and advances to the next phase.
     */    
    endCurrentPhase() {
        console.log('Ending phase', this.currentPhase);
        
        // Advance to next phase
        this.currentPhase++;
        
        // If past last phase, advance turn and reset to phase 1
        if (this.currentPhase > this.MAX_PHASE) {
            this.currentPhase = 1;
            this.currentTurn++;
        }
        
        // Update UI, etc.
        this.updatePhaseControlPanel();
    }

    /**
     * Hides the phase control panel.
     */
    hidePhaseControlPanel() {
        const panel = document.getElementById('phase_control_panel');
        if (panel) panel.remove();
    }

    /**
     * Resets all moves made during the current phase.
     */    
    resetAllMoves() {
        console.log('Reset all moves');
        // TODO: Implement reset logic
    }

    /**
     * Displays the phase control panel with turn/phase info and action buttons.
     */
    showPhaseControlPanel() {
        // Remove any existing panel (prevents duplicate listeners)
        const existingPanel = document.getElementById('phase_control_panel');
        if (existingPanel) existingPanel.remove();
        
        const phaseInfo = this.PHASES[this.currentPhase];
        if (!phaseInfo) {
            console.error('Invalid phase:', this.currentPhase);
            return;
        }
        
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

    /**
     * Displays a phase notification panel with optional message.
     * @param {number} turnNumber - Current turn number
     * @param {number} phaseNumber - Current phase number (1-8)
     * @param {string} phaseName - Name of the phase
     * @param {string|null} message - Optional message to display
     * @param {boolean} canSkip - Whether the phase can be skipped
     */
    showPhasePanel(turnNumber, phaseNumber, phaseName, message = null, canSkip = false) {
        // Validate phase number
        if (phaseNumber < 1 || phaseNumber > this.MAX_PHASE) {
            console.error('Invalid phase:', phaseNumber);
            return;
        }

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

    /**
     * Undoes the last move made during the current phase.
     */
    undoLastMove() {
        console.log('Undo last move');
        // TODO: Implement undo logic
    }

    /**
     * Updates the phase control panel to reflect current turn and phase.
     */
    updatePhaseControlPanel() {
        const panel = document.getElementById('phase_control_panel');
        if (!panel) return;
        
        const phaseInfo = this.PHASES[this.currentPhase];
        // validation
        if (!phaseInfo) {
            console.error('Invalid phase:', this.currentPhase);
            return;
        }

        panel.querySelector('h3').textContent = `Turn ${this.currentTurn} - Phase ${this.currentPhase}`;
        panel.querySelector('h4').textContent = phaseInfo.name;
    }
}