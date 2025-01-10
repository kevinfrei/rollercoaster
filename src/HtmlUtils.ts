//@flow

const GetRGB = (color: string): {r : number, g : number, b : number} => {
  if (color.length < 3) {
    return {r : 0, g : 0, b : 0};
  }
  if (color[0] === '#') {
    return GetRGB(color.substr(1));
  }
  if (!color.match(/^[0-9A-Fa-f]+$/) ||
      ((color.length !== 3) && (color.length !== 6))) {
    return {r : 0, g : 0, b : 0};
  }
  const val = parseInt(color, 16);
  const bits = (color.length === 3) ? 4 : 8;
  const mask = (1 << bits) - 1;
  const b = val & mask;
  const g = (val >> bits) & mask;
  const r = (val >> (2 * bits)) & mask;
  return {r, g, b};
};

export const GetTextColor = (bgcolor: string): string => {
  const {r, g, b} = GetRGB(bgcolor);

  // Counting the perceptive luminance - human eye favors green color...
  const a = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return (a < .5) ? '#000' : '#FFFFFF';
}
