const isWallCollision = (x, radius, width) => {
  return x < radius || x > width - radius;
};

export { isWallCollision };