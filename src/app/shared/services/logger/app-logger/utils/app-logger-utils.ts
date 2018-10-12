export function contain(arr: any[], item: any): boolean {
    return arr.filter(l => l === item || ((item.match && typeof item.match === 'function') ? item.match(l) : false)).length > 0;
};

export function getRandomColor(): string {
    let letters = '012345'.split('');
    let color = '#';
    color += letters[Math.round(Math.random() * 5)];
    letters = '0123456789ABCDEF'.split('');
    for (let i = 0; i < 5; i++) {
      color += letters[Math.round(Math.random() * 15)];
    }
    if (color === undefined) return this.getRandomColor();
    return color;
  }