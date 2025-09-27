export const breakpoints = {
  mobile: 480,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  wide: 1440,
} as const;

export type BreakpointKey = keyof typeof breakpoints;

export const bp = Object.fromEntries(
  Object.entries(breakpoints).map(([key, value]) => [key, `${value}px`]),
) as Record<BreakpointKey, string>;

const createMediaQuery = (type: 'min' | 'max') => (key: BreakpointKey) =>
  `@media (${type}-width: ${bp[key]})`;

const up = createMediaQuery('min');
const down = createMediaQuery('max');

export const media = {
  up,
  down,
  between: (from: BreakpointKey, to: BreakpointKey) => {
    const [minKey, maxKey] = breakpoints[from] <= breakpoints[to] ? [from, to] : [to, from];

    if (minKey === maxKey) {
      return down(maxKey);
    }

    return `@media (min-width: ${bp[minKey]}) and (max-width: ${bp[maxKey]})`;
  },
};
