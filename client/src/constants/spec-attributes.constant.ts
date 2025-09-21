// Ключи характеристик → человекочитаемые русские названия
// Основано на seed данных (server/prisma/seed.js)

export const specAttributeRuMap: Record<string, string> = {
  weight: 'Вес',
  run_time: 'Максимальное время работы',
  suction_power: 'Сила всасывания (режим Powerful)',
  bin_volume: 'Объём контейнера',
  cyclone_tech: 'Технология циклонов',
  filtration: 'Фильтрация',
  charge_time: 'Время зарядки',
  height: 'Высота',
  length: 'Длина',
  width: 'Ширина',
};

export const specAttributeUnitRuMap: Record<string, string> = {
  kg: 'кг',
  min: 'мин',
  W: 'Вт',
  L: 'л',
  mm: 'мм',
  hrs: 'часа',
};

export const specFromAtttributeUnitMap: Record<string, string> = {
  cyclone_tech: 'циклоны',
};

export const specPriorityMap: Record<string, number> = {
  weight: 1,
  charge_time: 2,
  run_time: 3,
  bin_volume: 4,
  suction_power: 5,
  filtration: 6,
};

export type SpecAttributeKey = keyof typeof specAttributeRuMap;
