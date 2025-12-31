/**
 * CombatManager.js
 *
 * Manages combat resolution for Phase 3 (German) and Phase 7 (Soviet).
 */

export class CombatManager {
    constructor(game) {
        this.game = game;

        // Combat Results Table (CRT)
        // Rows = die roll (1-6), Columns = odds (1:1, 2:1, 3:1, 4:1, 5:1, 6:1)
        // Results: NE, DR, DRL, AL, DE, EX
        this.CRT = {
            1: ['DR',  'DR',  'DR',  'DR',  'DR',  'DRL'],
            2: ['EX',  'DR',  'DR',  'DR',  'DRL', 'DRL'],
            3: ['EX',  'EX',  'DR',  'EX',  'DRL', 'DE'],
            4: ['NE',  'EX',  'EX',  'DRL', 'DRL', 'DE'],
            5: ['NE',  'NE',  'EX',  'DRL', 'DE',  'DE'],
            6: ['AL',  'NE',  'DRL', 'DE',  'DE',  'DE']
        };

        // Odds levels for the CRT
        this.ODDS_LEVELS = ['1:1', '2:1', '3:1', '4:1', '5:1', '6:1'];

        // Battle tracking
        this.declaredBattles = [];  // Array of {defender: hexId, attackers: [hexId1, hexId2, ...]}
        this.temporaryAttacker = null;  // ADD THIS - stores the "pending" attacker
        this.unitsAttackedThisPhase = new Set();  // Defenders already attacked
        this.unitsAttackingThisPhase = new Set();  // Attackers already committed
    }

    /**
     * Checks if all attacking units are across a river from the defender.
     * @param {string} defenderHexId - Defender hex ID
     * @param {string[]} attackerHexIds - Array of attacker hex IDs
     * @returns {boolean} True if ALL attackers are across a river
     */
    areAllAttackersAcrossRiver(defenderHexId, attackerHexIds) {
        if (attackerHexIds.length === 0) return false;

        for (const attackerHexId of attackerHexIds) {
            if (!this.isAcrossRiver(attackerHexId, defenderHexId)) {
                return false;  // At least one attacker is NOT across a river
            }
        }

        return true;  // All attackers are across a river
    }

    /**
     * Calculates combat odds for a battle.
     * @param {string} defenderHexId - Hex ID of defender
     * @param {string[]} attackerHexIds - Array of attacker hex IDs
     * @returns {Object} { attackStrength, defenseStrength, baseOdds, modifiedOdds, oddsLevel, modifiers: [] }
     */
    calculateOdds(defenderHexId, attackerHexIds) {
        // Get defender data
        const defender = this.game.unitManager.unitRegistry.get(defenderHexId);
        if (!defender) {
            console.error('Defender not found:', defenderHexId);
            return null;
        }

        // Calculate total attack strength
        let attackStrength = 0;
        for (const attackerHexId of attackerHexIds) {
            const attacker = this.game.unitManager.unitRegistry.get(attackerHexId);
            if (attacker) {
                attackStrength += attacker.strength;
            }
        }

        // Get defense strength
        let defenseStrength = defender.strength;

        // Calculate base odds (attack / defense, rounded down)
        const baseOddsRatio = Math.floor(attackStrength / defenseStrength);

        // Apply terrain modifiers
        const modifiers = [];
        let oddsShift = 0;

        // Check terrain
        const defenderHex = this.game.mapData.HEX_DATA[defenderHexId];

        // Forest: -1 odds level
        if (defenderHex.terrain === 'forest') {
            oddsShift -= 1;
            modifiers.push('Forest (-1)');
        }

        // Moscow: -1 odds level
        if (defenderHex.city === 'moscow') {
            oddsShift -= 1;
            modifiers.push('Moscow (-1)');
        }

        // Soviet in fortification: -1 odds level
        if (defenderHex.terrain === 'fort' && defender.faction === 'soviet') {
            oddsShift -= 1;
            modifiers.push('Fortification (-1)');
        }

        // River: Check if ALL attackers are across a river from defender
        if (this.areAllAttackersAcrossRiver(defenderHexId, attackerHexIds)) {
            oddsShift -= 1;
            modifiers.push('River (-1)');
        }

        // Apply odds shift (can't go below 0:1 or above 6:1)
        let modifiedOddsRatio = baseOddsRatio + oddsShift;

        console.log(`Odds calculation: ${attackStrength} vs ${defenseStrength}`);
        console.log(`Base ratio: ${baseOddsRatio}, Shift: ${oddsShift}, Modified: ${modifiedOddsRatio}`);
        console.log(`Modifiers:`, modifiers);

        // Cap at 6:1 maximum
        if (modifiedOddsRatio > 6) {
            modifiedOddsRatio = 6;
        }

        // Get odds level (1:1, 2:1, etc.) or null if below 1:1
        let oddsLevel = null;
        if (modifiedOddsRatio >= 1 && modifiedOddsRatio <= 6) {
            oddsLevel = this.ODDS_LEVELS[modifiedOddsRatio - 1];
        }

        return {
            attackStrength,
            defenseStrength,
            baseOdds: `${baseOddsRatio}:1`,
            modifiedOdds: modifiedOddsRatio >= 1 ? `${modifiedOddsRatio}:1` : 'Below 1:1',
            oddsLevel,
            oddsShift,
            modifiers
        };
    }

    /**
     * Cancels a declared battle and returns units to available pool.
     * @param {number} battleIndex - Index of the battle in declaredBattles array
     */
    cancelBattle(battleIndex) {
        if (battleIndex < 0 || battleIndex >= this.declaredBattles.length) {
            console.error('Invalid battle index:', battleIndex);
            return;
        }

        const battle = this.declaredBattles[battleIndex];

        // Remove defender from attacked list
        this.unitsAttackedThisPhase.delete(battle.defender);

        // Remove attackers from attacking list
        battle.attackers.forEach(hexId => {
            this.unitsAttackingThisPhase.delete(hexId);
        });

        // Remove battle from list
        this.declaredBattles.splice(battleIndex, 1);

        // Update UI
        this.updateCombatUI();

        console.log(`Battle ${battleIndex} cancelled`);
    }

    /**
     * Removes all combat-related visual highlights from the map.
     */
    clearAllCombatHighlights() {
        // Restore original positions for nudged attackers
        document.querySelectorAll('.attacker-selected').forEach(el => {
            if (el.dataset.originalLeft) {
                el.style.left = el.dataset.originalLeft;
                el.style.top = el.dataset.originalTop;
                delete el.dataset.originalLeft;
                delete el.dataset.originalTop;
            }
            el.style.outline = 'none';
            el.classList.remove('attacker-selected');
        });

        // Clear odds badges
        document.querySelectorAll('.odds-badge').forEach(el => el.remove());

        // Clear defender highlights
        document.querySelectorAll('.defender-highlight').forEach(el => el.remove());

        // Clear battle markers
        document.querySelectorAll('.battle-marker').forEach(el => el.remove());
    }

    /**
     * Clears all battle declarations and resets combat state.
     */
    clearBattles() {
        this.declaredBattles = [];
        this.temporaryAttacker = null;  // Changed from selectedAttackers.clear()
        this.unitsAttackedThisPhase.clear();
        this.unitsAttackingThisPhase.clear();

        // Clear visual indicators
        this.clearAllCombatHighlights();

        // Remove battle list panel
        const panel = document.getElementById('battle_list_panel');
        if (panel) panel.remove();
    }

    /**
     * Enables combat selection for eligible units in the current phase.
     */
    enableCombatSelection() {
        const friendlyFaction = this.getCurrentCombatFaction();
        const enemyFaction = this.getEnemyFaction();
        
        // Remove any existing click handlers from movement phase
        document.querySelectorAll('.unit').forEach(unitDiv => {
            // Clone to remove all event listeners
            const newUnitDiv = unitDiv.cloneNode(true);
            unitDiv.parentNode.replaceChild(newUnitDiv, unitDiv);
        });
        
        // Now add combat click handlers to the fresh units
        this.game.unitManager.unitRegistry.forEach((unit, hexId) => {
            const unitDiv = document.getElementById(`unit_${hexId}`);
            if (!unitDiv) return;
            
            if (unit.faction === friendlyFaction) {
                // Friendly units = attackers
                unitDiv.style.cursor = 'pointer';
                unitDiv.addEventListener('click', (evt) => {
                    evt.stopPropagation();
                    this.onUnitClick(unitDiv);
                });
            } else if (unit.faction === enemyFaction) {
                // Enemy units = defenders
                unitDiv.style.cursor = 'pointer';
                unitDiv.addEventListener('click', (evt) => {
                    evt.stopPropagation();
                    this.onDefenderClick(unitDiv);
                });
            }
        });
        
        console.log('Combat selection enabled for Phase', this.game.phaseManager.currentPhase);
    }

    /**
     * Gets the current faction in the combat phase.
     * @returns {string} 'german' for Phase 3, 'soviet' for Phase 7
     */
    getCurrentCombatFaction() {
        return this.game.phaseManager.currentPhase === 3 ? 'german' : 'soviet';
    }

    /**
     * Gets the direction from one hex to an adjacent hex.
     * @param {string} fromHexId - Starting hex
     * @param {string} toHexId - Destination hex
     * @returns {string|null} Direction ('N', 'NE', 'SE', 'S', 'SW', 'NW') or null
     */
    getDirection(fromHexId, toHexId) {
        const col1 = parseInt(fromHexId.substring(0, 2));
        const row1 = parseInt(fromHexId.substring(2, 4));
        const col2 = parseInt(toHexId.substring(0, 2));
        const row2 = parseInt(toHexId.substring(2, 4));

        const dcol = col2 - col1;
        const drow = row2 - row1;
        const isEvenCol = (col1 % 2 === 0);

        // Map offset to direction based on column parity
        const offsets = isEvenCol ? {
            '0,-1': 'N',
            '1,0': 'NE',
            '1,1': 'SE',
            '0,1': 'S',
            '-1,1': 'SW',
            '-1,0': 'NW'
        } : {
            '0,-1': 'N',
            '1,-1': 'NE',
            '1,0': 'SE',
            '0,1': 'S',
            '-1,0': 'SW',
            '-1,-1': 'NW'
        };

        const key = `${dcol},${drow}`;
        return offsets[key] || null;
    }

    /**
     * Gets the enemy faction for the current combat phase.
     * @returns {string} 'soviet' for Phase 3, 'german' for Phase 7
     */
    getEnemyFaction() {
        return this.game.phaseManager.currentPhase === 3 ? 'soviet' : 'german';
    }

    /**
     * Checks if two adjacent hexes have a river between them.
     * @param {string} hexId1 - First hex ID
     * @param {string} hexId2 - Second hex ID
     * @returns {boolean} True if there's a river between them
     */
    isAcrossRiver(hexId1, hexId2) {
        // Get the direction from hexId1 to hexId2
        const direction = this.getDirection(hexId1, hexId2);
        if (!direction) return false;

        // Check if hexId1 has a river on that hexside
        const hex1 = this.game.mapData.HEX_DATA[hexId1];
        return hex1 && hex1.river && hex1.river.includes(direction);
    }

    /**
     * Handles clicking on an enemy unit to declare it as the target of an attack.
     * @param {HTMLElement} unitDiv - The clicked defender unit div
     */
    onDefenderClick(unitDiv) {
        const defenderHexId = unitDiv.id.replace('unit_', '');

        console.log(`Defender clicked: ${defenderHexId}`);

        // Must have a temporary attacker selected
        if (!this.temporaryAttacker) {
            console.log('❌ No attacker selected - select a friendly unit first');
            // Flash the unit to show it was clicked but can't be attacked yet
            unitDiv.style.outline = '3px solid red';
            setTimeout(() => { unitDiv.style.outline = 'none'; }, 500);
            return;
        }

        // Check if attacker is adjacent to this defender
        const attackerHexId = this.temporaryAttacker;
        const adjacentHexes = this.game.hexUtils.getAdjacentHexes(attackerHexId);
        
        if (!adjacentHexes.includes(defenderHexId)) {
            console.log('❌ Defender is not adjacent to selected attacker');
            unitDiv.style.outline = '3px solid red';
            setTimeout(() => { unitDiv.style.outline = 'none'; }, 500);
            return;
        }

        // Flash green to confirm
        unitDiv.style.outline = '3px solid lime';
        setTimeout(() => { unitDiv.style.outline = 'none'; }, 300);

        // Check if this defender already has a battle declared
        let existingBattle = this.declaredBattles.find(b => b.defender === defenderHexId);

        if (existingBattle) {
            // Add attacker to existing battle
            existingBattle.attackers.push(attackerHexId);
            console.log(`✅ Added ${attackerHexId} to existing battle against ${defenderHexId}`);
        } else {
            // Create new battle
            this.declaredBattles.push({
                defender: defenderHexId,
                attackers: [attackerHexId]
            });
            this.unitsAttackedThisPhase.add(defenderHexId);
            console.log(`✅ New battle declared: ${attackerHexId} attacking ${defenderHexId}`);
        }

        // Mark attacker as committed
        this.unitsAttackingThisPhase.add(attackerHexId);

        // Clear temporary selection
        const attackerDiv = document.getElementById(`unit_${attackerHexId}`);
        if (attackerDiv) {
            attackerDiv.style.outline = 'none';
        }
        this.temporaryAttacker = null;

        // Clear odds badges
        document.querySelectorAll('.odds-badge').forEach(el => el.remove());

        // Update UI (wait for flash to finish)
        setTimeout(() => {
            this.updateCombatUI();
        }, 300);
    }

    /**
     * Handles clicking on a friendly unit to select it as an attacker.
     * @param {HTMLElement} unitDiv - The clicked unit div
     */
    onUnitClick(unitDiv) {
        const hexId = unitDiv.id.replace('unit_', '');
        const unit = this.game.unitManager.unitRegistry.get(hexId);

        if (!unit) {
            console.log('Unit not found:', hexId);
            return;
        }

        // Check if clicking the already-selected temporary attacker (deselect)
        if (this.temporaryAttacker === hexId) {
            console.log('Deselecting temporary attacker');
            unitDiv.style.outline = 'none';
            this.temporaryAttacker = null;
            
            // Clear odds badges
            document.querySelectorAll('.odds-badge').forEach(el => el.remove());
            return;
        }

        // Check if unit is already committed to a battle
        if (this.unitsAttackingThisPhase.has(hexId)) {
            console.log('Removing unit from its battle');
            
            // Find which battle this unit is in
            for (let i = 0; i < this.declaredBattles.length; i++) {
                const battle = this.declaredBattles[i];
                const attackerIndex = battle.attackers.indexOf(hexId);
                
                if (attackerIndex !== -1) {
                    // Remove this attacker from the battle
                    this.removeAttackerFromBattle(i, hexId);
                    return;
                }
            }
            return;
        }

        // Check if unit has any adjacent enemies it can attack
        const adjacentHexes = this.game.hexUtils.getAdjacentHexes(hexId);
        const enemyFaction = this.getEnemyFaction();
        let hasAdjacentEnemies = false;

        for (const adjHexId of adjacentHexes) {
            const adjUnit = this.game.unitManager.unitRegistry.get(adjHexId);
            if (adjUnit && adjUnit.faction === enemyFaction) {
                hasAdjacentEnemies = true;
                break;
            }
        }

        if (!hasAdjacentEnemies) {
            console.log('❌ No adjacent enemies to attack');
            // Flash unit to show it was clicked but can't attack
            unitDiv.style.outline = '3px solid orange';
            setTimeout(() => { unitDiv.style.outline = 'none'; }, 500);
            return;
        }

        // Clear any previous temporary selection
        if (this.temporaryAttacker) {
            const prevDiv = document.getElementById(`unit_${this.temporaryAttacker}`);
            if (prevDiv) {
                prevDiv.style.outline = 'none';
            }
        }

        // Store as temporary attacker (waiting for defender click)
        this.temporaryAttacker = hexId;
        unitDiv.style.outline = '3px solid yellow';

        // Show odds badges on adjacent enemies
        this.showAdjacentDefenderOdds(hexId);

        console.log(`Temporary attacker selected: ${hexId} - now click an adjacent enemy`);
    }

    /**
     * Removes an attacker from a declared battle.
     * @param {number} battleIndex - Index of the battle in declaredBattles array
     * @param {string} attackerHexId - Hex ID of the attacker to remove
     */
    removeAttackerFromBattle(battleIndex, attackerHexId) {
        if (battleIndex < 0 || battleIndex >= this.declaredBattles.length) {
            console.error('Invalid battle index:', battleIndex);
            return;
        }

        const battle = this.declaredBattles[battleIndex];
        const attackerIndex = battle.attackers.indexOf(attackerHexId);

        if (attackerIndex === -1) {
            console.error('Attacker not found in battle:', attackerHexId);
            return;
        }

        // Remove attacker from battle
        battle.attackers.splice(attackerIndex, 1);

        // Remove from attacking set
        this.unitsAttackingThisPhase.delete(attackerHexId);

        // If no attackers left, cancel the entire battle
        if (battle.attackers.length === 0) {
            this.cancelBattle(battleIndex);
            return;
        }

        // Update UI
        this.updateCombatUI();

        console.log(`Removed attacker ${attackerHexId} from battle ${battleIndex}`);
    }

    /**
     * Resolves a battle using the CRT.
     * @param {number} dieRoll - Die roll (1-6)
     * @param {string} oddsLevel - Odds level ('1:1', '2:1', etc.')
     * @returns {string} Combat result ('NE', 'DR', 'DRL', 'AL', 'DE', 'EX')
     */
    resolveCombat(dieRoll, oddsLevel) {
        if (dieRoll < 1 || dieRoll > 6) {
            console.error('Invalid die roll:', dieRoll);
            return 'NE';
        }

        const oddsIndex = this.ODDS_LEVELS.indexOf(oddsLevel);
        if (oddsIndex === -1) {
            console.error('Invalid odds level:', oddsLevel);
            return 'NE';
        }

        return this.CRT[dieRoll][oddsIndex];
    }

    /**
     * Shows odds badges on adjacent enemy units for a selected attacker.
     * @param {string} attackerHexId - The selected attacker hex ID
     */
    showAdjacentDefenderOdds(attackerHexId) {
        // Clear existing odds badges
        document.querySelectorAll('.odds-badge').forEach(el => el.remove());

        const enemyFaction = this.getEnemyFaction();
        const adjacentHexes = this.game.hexUtils.getAdjacentHexes(attackerHexId);

        // Show odds on each adjacent enemy
        for (const adjHexId of adjacentHexes) {
            const unit = this.game.unitManager.unitRegistry.get(adjHexId);
            if (unit && unit.faction === enemyFaction) {
                // Check if this defender already has a battle declared
                const existingBattle = this.declaredBattles.find(b => b.defender === adjHexId);
                
                let attackerHexIds;
                if (existingBattle) {
                    // Include existing attackers PLUS the new one
                    attackerHexIds = [...existingBattle.attackers, attackerHexId];
                } else {
                    // Just the new attacker
                    attackerHexIds = [attackerHexId];
                }
                
                const odds = this.calculateOdds(adjHexId, attackerHexIds);
                if (odds) {
                    this.showOddsBadge(adjHexId, odds);
                }
            }
        }
    }

    /**
     * Shows visual markers for all declared battles.
     */
    showDeclaredBattles() {
        this.declaredBattles.forEach((battle, index) => {
            const battleNum = index + 1;

            // Mark defender with battle number
            const defenderDiv = document.getElementById(`unit_${battle.defender}`);
            if (defenderDiv) {
                const marker = document.createElement('div');
                marker.className = 'battle-marker';
                marker.textContent = `#${battleNum}`;
                marker.style.cssText = `
                    position: absolute;
                    top: -8px;
                    left: -8px;
                    width: 20px;
                    height: 20px;
                    background: #ff4444;
                    color: white;
                    border: 2px solid black;
                    border-radius: 50%;
                    font-size: 12px;
                    font-weight: bold;
                    line-height: 20px;
                    text-align: center;
                    z-index: 100;
                    pointer-events: none;
                `;
                defenderDiv.appendChild(marker);
            }

            // Get defender position for nudging calculation
            const defenderPos = this.game.hexUtils.hexToUnitPixelCoords(battle.defender);

            // Mark attackers with battle number and nudge toward defender
            battle.attackers.forEach(attackerHexId => {
                const attackerDiv = document.getElementById(`unit_${attackerHexId}`);
                if (attackerDiv) {
                    attackerDiv.style.outline = '3px solid #ff4444';
                    attackerDiv.classList.add('attacker-selected');

                    // Store original position if not already stored
                    if (!attackerDiv.dataset.originalLeft) {
                        attackerDiv.dataset.originalLeft = attackerDiv.style.left;
                        attackerDiv.dataset.originalTop = attackerDiv.style.top;
                    }

                    // Calculate nudge direction toward defender
                    const attackerPos = this.game.hexUtils.hexToUnitPixelCoords(attackerHexId);
                    const dx = defenderPos.x - attackerPos.x;
                    const dy = defenderPos.y - attackerPos.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Nudge 12 pixels toward defender
                    const nudgeAmount = 12;
                    const nudgeX = (dx / distance) * nudgeAmount;
                    const nudgeY = (dy / distance) * nudgeAmount;
                    
                    // Apply nudge
                    attackerDiv.style.left = (attackerPos.x + nudgeX) + 'px';
                    attackerDiv.style.top = (attackerPos.y + nudgeY) + 'px';

                    const marker = document.createElement('div');
                    marker.className = 'battle-marker';
                    marker.textContent = `#${battleNum}`;
                    marker.style.cssText = `
                        position: absolute;
                        top: -8px;
                        left: -8px;
                        width: 20px;
                        height: 20px;
                        background: #4444ff;
                        color: white;
                        border: 2px solid black;
                        border-radius: 50%;
                        font-size: 12px;
                        font-weight: bold;
                        line-height: 20px;
                        text-align: center;
                        z-index: 100;
                        pointer-events: none;
                    `;
                    attackerDiv.appendChild(marker);
                }
            });
        });
    }

    /**
     * Displays an odds badge on a defender unit.
     * @param {string} defenderHexId - Hex ID of the defender
     * @param {Object} odds - Odds calculation result from calculateOdds()
     */
    showOddsBadge(defenderHexId, odds) {
        const unitDiv = document.getElementById(`unit_${defenderHexId}`);
        if (!unitDiv) return;

        // Create badge element
        const badge = document.createElement('div');
        badge.className = 'odds-badge';
        badge.textContent = odds.modifiedOdds;

        // Color code based on odds quality
        let bgColor = '#ff4444';  // Red = poor odds
        if (odds.oddsLevel) {
            const oddsRatio = parseInt(odds.oddsLevel.split(':')[0]);
            if (oddsRatio >= 4) {
                bgColor = '#44ff44';  // Green = good odds
            } else if (oddsRatio >= 2) {
                bgColor = '#ffaa44';  // Orange = moderate odds
            }
        }

        badge.style.cssText = `
            position: absolute;
            top: -8px;
            right: -8px;
            min-width: 32px;
            height: 20px;
            background: ${bgColor};
            color: black;
            border: 2px solid black;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            line-height: 20px;
            text-align: center;
            padding: 0 4px;
            z-index: 100;
            pointer-events: none;
        `;

        // Add tooltip with breakdown
        if (odds.modifiers.length > 0) {
            badge.title = `Base: ${odds.baseOdds}\n${odds.modifiers.join('\n')}\nFinal: ${odds.modifiedOdds}`;
        } else {
            badge.title = `Odds: ${odds.modifiedOdds}`;
        }

        unitDiv.appendChild(badge);
    }

/**
     * Updates the battle list panel showing all declared battles.
     */
    updateBattleListPanel() {
        // Remove existing panel
        const existingPanel = document.getElementById('battle_list_panel');
        if (existingPanel) existingPanel.remove();

        // Don't show panel if no battles declared
        if (this.declaredBattles.length === 0) {
            console.log('No battles to display in panel');
            return;
        }

        console.log(`Creating battle list panel with ${this.declaredBattles.length} battles`);

        // Get map position to dock panel beside it
        const mapContainer = document.getElementById('game_map');
        const mapRect = mapContainer.getBoundingClientRect();
        
        // Calculate available space for panel
        const viewportWidth = window.innerWidth;
        const spaceAvailable = viewportWidth - mapRect.right - 25; // 25px for margins
        
        // Determine panel width: 2 columns if space available, else 1 column
        // const twoColumnWidth = 516; // 240px × 2 + 8px gap + padding
        // const oneColumnWidth = 320; // Increased from 270 to fit header comfortably
        // const panelWidth = spaceAvailable >= twoColumnWidth ? twoColumnWidth : oneColumnWidth;
        // Determine panel width: 2 columns if space available, else 1 column
        const twoColumnWidth = 520; // 240px × 2 + 8px gap + 30px padding + 2px buffer
        const oneColumnWidth = 270; // Single column: 240px + 30px padding
        const panelWidth = spaceAvailable >= twoColumnWidth ? twoColumnWidth : oneColumnWidth;

        // Create panel
        const panel = document.createElement('div');
        panel.id = 'battle_list_panel';
        
        // Account for header (36px) + padding (30px) = 66px
        const maxPanelHeight = mapRect.height - 66;
        
        panel.style.cssText = `
            position: absolute;
            top: 0px;
            left: ${mapRect.right + 5}px;
            background: rgba(40, 60, 80, 0.95);
            border: 3px solid #666;
            border-radius: 8px;
            padding: 15px;
            color: white;
            font-family: Arial, sans-serif;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            width: ${panelWidth}px;
            max-height: ${mapRect.height}px;
        `;

        // Header with Cancel All button
        let html = `
            <div style="display: flex; align-items: center; margin: 0 0 10px 0; border-bottom: 2px solid #666; padding-bottom: 5px;">
                <h3 style="margin: 0; font-size: 16px; flex: 1;">Battles</h3>
                <button
                    onclick="window.das_game.combatManager.confirmCancelAllBattles()"
                    style="padding: 4px 8px; font-size: 11px; cursor: pointer; background: #ff4444; color: white; border: 1px solid #000; border-radius: 3px; white-space: nowrap;">
                    Cancel All
                </button>
            </div>
        `;
        
        html += `<div style="display: grid; grid-template-columns: repeat(auto-fit, 240px); gap: 8px; overflow-y: auto; justify-content: start; flex: 1; max-height: ${maxPanelHeight}px;">`;

        this.declaredBattles.forEach((battle, index) => {
            const odds = this.calculateOdds(battle.defender, battle.attackers);
            const defenderUnit = this.game.unitManager.unitRegistry.get(battle.defender);

            // Calculate attack strength
            const attackStrength = battle.attackers.reduce((sum, hexId) => {
                const unit = this.game.unitManager.unitRegistry.get(hexId);
                return sum + (unit?.strength || 0);
            }, 0);
            const defenseStrength = defenderUnit?.strength || 0;
            
            // Format modifiers naturally (only show if they apply)
            let modifiersText = '';
            if (odds.modifiers.length > 0) {
                const terrainMods = [];
                const riverMod = [];
                
                odds.modifiers.forEach(m => {
                    const clean = m.replace(/ \(-1\)$/, '');
                    if (clean === 'River') {
                        riverMod.push('behind a River');
                    } else if (clean === 'Fortification') {
                        terrainMods.push('a Fort');
                    } else if (clean === 'Forest') {
                        terrainMods.push('a Forest');
                    } else if (clean === 'Moscow') {
                        terrainMods.push('Moscow');
                    }
                });
                
                // Build text: terrain first, then river
                if (terrainMods.length > 0) {
                    modifiersText = ` in ${terrainMods.join(' and ')}`;
                }
                if (riverMod.length > 0) {
                    modifiersText += ' ' + riverMod[0];
                }
            }

            html += `
                <div style="background: rgba(255,255,255,0.1); padding: 8px; border-radius: 4px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="font-weight: bold;">Battle #${index + 1}</span>
                        <span style="font-weight: bold; color: ${odds.oddsLevel ? '#44ff44' : '#ff4444'};">${odds.modifiedOdds}</span>
                    </div>
                    <div style="font-size: 12px; margin-bottom: 6px;">
                        ${attackStrength} vs ${defenseStrength}${modifiersText}
                    </div>
                    <button
                        onclick="window.das_game.combatManager.cancelBattle(${index})"
                        style="width: 100%; padding: 4px 8px; font-size: 11px; cursor: pointer; background: #ff4444; color: white; border: 1px solid #000; border-radius: 3px;">
                        Cancel Battle
                    </button>
                </div>
            `;
        });

        html += '</div>';

        panel.innerHTML = html;
        
        // Append to game_play_area
        const gamePlayArea = document.getElementById('game_play_area');
        gamePlayArea.appendChild(panel);
    }

    /**
     * Shows confirmation dialog before canceling all battles.
     */
    confirmCancelAllBattles() {
        const confirmed = confirm(`Cancel all ${this.declaredBattles.length} declared battles?`);
        if (confirmed) {
            this.clearBattles();
        }
    }

    /**
     * Updates the entire combat UI (badges, highlights, etc.).
     */
    updateCombatUI() {
        this.clearAllCombatHighlights();
        this.showDeclaredBattles();
        this.updateOddsBadges();
        this.updateBattleListPanel();
    }

    /**
     * Updates odds badges on all potential enemy defenders.
     */
    updateOddsBadges() {
        // Remove existing badges
        document.querySelectorAll('.odds-badge').forEach(el => el.remove());

        // Don't show badges if no temporary attacker
        if (!this.temporaryAttacker) {
            return;
        }

        const attackerHexIds = [this.temporaryAttacker];
        const enemyFaction = this.getEnemyFaction();

        // Find all adjacent enemy units
        const potentialDefenders = new Set();
        for (const attackerHexId of attackerHexIds) {
            const adjacentHexes = this.game.hexUtils.getAdjacentHexes(attackerHexId);
            for (const adjHexId of adjacentHexes) {
                const unit = this.game.unitManager.unitRegistry.get(adjHexId);
                if (unit && unit.faction === enemyFaction && !this.unitsAttackedThisPhase.has(adjHexId)) {
                    potentialDefenders.add(adjHexId);
                }
            }
        }

        // Show odds badge on each potential defender
        for (const defenderHexId of potentialDefenders) {
            const odds = this.calculateOdds(defenderHexId, attackerHexIds);
            if (odds) {
                this.showOddsBadge(defenderHexId, odds);
            }
        }
    }
}