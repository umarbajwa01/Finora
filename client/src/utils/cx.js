// Tiny classnames combiner so components don't need a full library for this.
export const cx = (...args) => args.filter(Boolean).join(" ");
