/**
 * PhaseManager.js
 * 
 * Manages game phases, turn tracking, and phase-related UI panels.
 */

export class PhaseManager {
    constructor(game) {
        this.game = game;
        
        // Game state tracking
        this.currentTurn = 1;
        this.currentPhase = 1;  // 1-8 (see phase list below)
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

    closePhasePanel() {
        const panel = document.getElementById('phase_panel');
        if (panel) panel.remove();
    }

    hidePhaseControlPanel() {
        const panel = document.getElementById('phase_control_panel');
        if (panel) panel.remove();
    }

    endCurrentPhase() {
        console.log('Ending phase', this.currentPhase);
        // TODO: Validate phase completion, advance to next phase
    }

    resetAllMoves() {
        console.log('Reset all moves');
        // TODO: Implement reset logic
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

    undoLastMove() {
        console.log('Undo last move');
        // TODO: Implement undo logic
    }

    updatePhaseControlPanel() {
        const panel = document.getElementById('phase_control_panel');
        if (!panel) return;
        
        const phaseInfo = this.PHASES[this.currentPhase];
        panel.querySelector('h3').textContent = `Turn ${this.currentTurn} - Phase ${this.currentPhase}`;
        panel.querySelector('h4').textContent = phaseInfo.name;
    }
}