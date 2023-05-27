export const gameConfig = {
  width: 1400, // The width of the game screen
  height: 1000, // The height of the game screen
  paddleWidth: 6,
  paddleHeight: 150,
  paddleMargin: 15, // The distance from the paddle to the edge of the screen
  paddleSpeedPerSecond: 400, // The initial speed of the paddle
  ballRadius: 12.5,
  ballSpeedPerSecond: 300, // The initial speed of the ball
  timeStep: 1 / 60, // Fixed time step in seconds
  maxScore: 5, // The score needed to win the game
  pointCountDownDuration: 2, // seconds
  powerUpSpawnChance: 0.01, // The chance of a power up spawning every ticks
  powerUpRadius: 50,
  powerUpDuration: 4, // seconds
  ballRadiusChangePerPowerUp: 2.5,
  ballMinRadius: 5,
  ballMaxRadius: 20,
  paddleHeightChangePerPowerUp: 25,
  paddleMinHeight: 50,
  paddleMaxHeight: 200,
};
