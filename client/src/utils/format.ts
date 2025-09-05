// детерминированный форматер с пробелами — не зависит от ICU/локали
export const formatNumberRu = (n: number) =>
  Math.trunc(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export const formatPriceRub = (n: number) => `${formatNumberRu(n)} ₽`;
