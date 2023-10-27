const isWallCollision = (x, radius, width) => {
  return x < radius || x > width - radius;
};

const randomColor = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16)}`;

export { isWallCollision, randomColor };
