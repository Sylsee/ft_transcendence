export const gameConfig = {
  width: 1400, // The width of the game screen
  height: 1000, // The height of the game screen
  paddleWidth: 6,
  paddleHeight: 150,
  paddleMargin: 15, // The distance from the paddle to the edge of the screen
  paddleSpeedPerSecond: 400, // The initial speed of the paddle
  ballRadius: 12.5,
  ballSpeedPerSecond: 300, // The initial speed of the ball
  ballSpeedIncreasePerBounce: 50, // The speed increase of the ball after each bounce on a paddle
  ballMaxSpeed: 800, // The maximum speed of the ball
  timeStep: 1 / 60, // Fixed time step in seconds
  maxScore: 5, // The score needed to win the game
  pointCountDownDuration: 2, // seconds
  powerUpSpawnChance: 0.003, // The chance of a power up spawning every ticks
  powerUpRadius: 35,
  powerUpDuration: 6, // seconds
  ballRadiusChangePerPowerUp: 5,
  ballMinRadius: 7.5,
  ballMaxRadius: 30,
  paddleHeightChangePerPowerUp: 60,
  paddleMinHeight: 50,
  paddleMaxHeight: 300,
  maxBounceAngle: Math.PI / 4,
};
