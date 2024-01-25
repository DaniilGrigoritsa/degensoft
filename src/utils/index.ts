export const shuffleArray = <T>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export const randomTimeInterval = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const randomValueInterval = (min: number, max: number): number => {
    return (Math.random() * (max - min) + min);
}