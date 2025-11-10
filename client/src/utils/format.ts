// детерминированный форматер с пробелами — не зависит от ICU/локали
export const formatNumberRu = (n: number) =>
  Math.trunc(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export const formatPriceRub = (n: number) => `${formatNumberRu(n)} ₽`;

export const formatPrice = (price: number) => {
  if (price >= 1000 && price < 1000000) {
    return `${(price / 1000).toFixed(0)} тыс ₽`;
  }
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)} млн ₽`;
  }
  return `${price.toLocaleString('ru-RU')} ₽`;
};
