export enum ServerGameEvents {
  LobbyState = 'server.lobby.state',
  GameMessage = 'server.game.message',
  GameStart = 'server.game.start',
  GameFinish = 'server.game.finish',
  GameCountdown = 'server.game.countdown',
  GameState = 'server.game.state',
  GameScore = 'server.game.score',
  GameIsPowerUpActive = 'server.game.is-power-up-active',
  GamePowerUpSpawn = 'server.game.power-up-spawn',
  GamePowerUpDespawn = 'server.game.power-up-despawn',
}
