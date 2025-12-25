<?php

declare(strict_types=1);

namespace Bga\Games\BattleForMoscow\States;

use Bga\GameFramework\StateType;
use Bga\GameFramework\States\GameState;
use Bga\GameFramework\States\PossibleAction;
use Bga\GameFramework\UserException;
use Bga\Games\BattleForMoscow\Game;

class PlayerTurn extends GameState
{
    function __construct(
        protected Game $game,
    ) {
        parent::__construct($game,
            id: 10,
            type: StateType::ACTIVE_PLAYER,
            description: clienttranslate('${actplayer} must take an action'),
            descriptionMyTurn: clienttranslate('${you} must take an action'),
        );
    }

    /**
     * Game state arguments.
     * Returns information needed for the current player's turn.
     */
    public function getArgs(): array
    {
        // TODO: Return available actions (movable units, attackable hexes, etc.)
        return [];
    }    

    /**
     * Player action - pass turn.
     */
    #[PossibleAction]
    public function actPass(int $activePlayerId)
    {
        // Notify all players about the choice to pass.
        $this->notify->all("pass", clienttranslate('${player_name} passes'), [
            "player_id" => $activePlayerId,
            "player_name" => $this->game->getPlayerNameById($activePlayerId),
        ]);

        // Move to next player
        return NextPlayer::class;
    }

    /**
     * Zombie turn - AI takes over for disconnected player.
     */
    function zombie(int $playerId) {
        // For now, zombie just passes
        return $this->actPass($playerId);
    }
}