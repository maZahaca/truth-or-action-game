export type CardType = 'truth' | 'dare';

export interface Card {
  type: CardType;
  text: string;
}

export const truthCards: Card[] = [
  { type: 'truth', text: 'Какой твой самый любимый мультфильм и почему?' },
  { type: 'truth', text: 'Если бы ты мог иметь суперсилу, какую бы выбрал?' },
  { type: 'truth', text: 'Какой самый смешной случай произошёл с тобой в школе?' },
  { type: 'truth', text: 'Какое блюдо ты терпеть не можешь?' },
  { type: 'truth', text: 'Какой предмет в школе тебе нравится больше всего?' },
  { type: 'truth', text: 'Если бы ты был животным, каким бы ты был?' },
  { type: 'truth', text: 'Какой самый необычный сон тебе снился?' },
  { type: 'truth', text: 'Чего ты больше всего боишься?' },
  { type: 'truth', text: 'Какую книгу ты прочитал последней?' },
  { type: 'truth', text: 'Если бы ты мог поехать куда угодно, куда бы отправился?' },
  { type: 'truth', text: 'Какой твой самый любимый праздник?' },
  { type: 'truth', text: 'Кто твой лучший друг и почему?' },
  { type: 'truth', text: 'Какую игру ты любишь больше всего?' },
  { type: 'truth', text: 'Что бы ты сделал, если бы нашёл миллион?' },
  { type: 'truth', text: 'Какой твой самый любимый цвет и почему?' },
  { type: 'truth', text: 'Ты когда-нибудь списывал на контрольной?' },
  { type: 'truth', text: 'Какая у тебя самая плохая привычка?' },
  { type: 'truth', text: 'Что бы ты взял с собой на необитаемый остров?' },
  { type: 'truth', text: 'Какой подарок ты хочешь на день рождения?' },
  { type: 'truth', text: 'Если бы ты стал невидимым, что бы ты делал?' },
  { type: 'truth', text: 'Какой у тебя любимый десерт?' },
  { type: 'truth', text: 'Ты веришь в инопланетян?' },
  { type: 'truth', text: 'Какое твоё самое большое достижение?' },
  { type: 'truth', text: 'Что тебя больше всего раздражает?' },
  { type: 'truth', text: 'Какой фильм тебя напугал больше всего?' },
];

export const dareCards: Card[] = [
  { type: 'dare', text: 'Изобрази своё любимое животное!' },
  { type: 'dare', text: 'Спой куплет любой песни!' },
  { type: 'dare', text: 'Сделай 10 приседаний!' },
  { type: 'dare', text: 'Покажи самый смешной танец!' },
  { type: 'dare', text: 'Расскажи скороговорку быстро 3 раза!' },
  { type: 'dare', text: 'Изобрази робота на 15 секунд!' },
  { type: 'dare', text: 'Покажи пантомиму — другие должны угадать!' },
  { type: 'dare', text: 'Скажи комплимент каждому игроку!' },
  { type: 'dare', text: 'Изобрази учителя!' },
  { type: 'dare', text: 'Сделай смешную рожицу и не смейся 10 секунд!' },
  { type: 'dare', text: 'Прыгай на одной ноге 15 секунд!' },
  { type: 'dare', text: 'Расскажи стишок с выражением!' },
  { type: 'dare', text: 'Покажи, как ты просыпаешься утром!' },
  { type: 'dare', text: 'Говори шёпотом до следующего хода!' },
  { type: 'dare', text: 'Изобрази знаменитого персонажа — другие угадывают!' },
  { type: 'dare', text: 'Хлопай в ладоши и топай ногами одновременно 15 секунд!' },
  { type: 'dare', text: 'Покажи, как ходит пингвин!' },
  { type: 'dare', text: 'Придумай и расскажи короткую историю за 30 секунд!' },
  { type: 'dare', text: 'Сделай 5 отжиманий!' },
  { type: 'dare', text: 'Изобрази замедленную съёмку!' },
  { type: 'dare', text: 'Нарисуй что-нибудь в воздухе — другие угадывают!' },
  { type: 'dare', text: 'Покажи свой лучший трюк!' },
  { type: 'dare', text: 'Попробуй лизнуть свой локоть!' },
  { type: 'dare', text: 'Изобрази, что ты в космосе!' },
  { type: 'dare', text: 'Закрой глаза и дотронься до своего носа!' },
];

export const allCards: Card[] = [...truthCards, ...dareCards];

export function getRandomCard(usedIndices: Set<number>): { card: Card; index: number } | null {
  const available = allCards
    .map((card, index) => ({ card, index }))
    .filter(({ index }) => !usedIndices.has(index));

  if (available.length === 0) return null;

  const randomIdx = Math.floor(Math.random() * available.length);
  return available[randomIdx];
}
