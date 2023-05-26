export enum ClientGameEvent {
  SearchGame = 'client.lobby.search',
  CancelSearchGame = 'client.lobby.cancel-search',
  CreateLobby = 'client.lobby.create',
  JoinLobby = 'client.lobby.join',
  /*
    lobbyId: string
  */
  LeaveLobby = 'client.lobby.leave',
  InviteToLobby = 'client.lobby.invite',
  /*
    userId: string
  */
  Ready = 'client.lobby.ready',
  Unready = 'client.lobby.unready',
  MovePaddle = 'client.game.move-paddle',
  /*
    direction: MovePaddleDto
  */
}
