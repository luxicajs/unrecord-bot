export default (lvl: number) => {
    let xp = 100;
    for (let i = 0; i < lvl; i++) {
        xp += 55 + 10 * i;
    }
    return xp;
};
