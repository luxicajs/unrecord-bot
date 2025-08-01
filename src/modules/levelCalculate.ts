// A really old algorithm. I wouldn't even call it an algorithm.
// If you got a better idea on how to make this. Feel free to let me know or send a PR.

export default (lvl: number) => {
  let xp = 100;
  for (let i = 0; i < lvl; i++) {
    xp += 55 + 10 * i;
  }
  return xp;
};
