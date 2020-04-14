import { Card, Sign } from '../models/game.model';

export function initDeck(): Card[] {
  let deck: Card[] = [];
  for (let i = 1; i < 11; i++) {
    deck.push({ value: i, type: "B" });
    deck.push({ value: i, type: "C" });
    deck.push({ value: i, type: "D" });
    deck.push({ value: i, type: "S" });
  }
  return deck;
}

export function shuffleCards(): Card[] {
  let shuffled = initDeck()
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value)

  return shuffled;
}

export function getWinningCard(cards: Card[], king: Sign, defaultSign: Sign): Card {
  if (cards.length == 1) return cards[0];
  if (king) {
    const kings = cards.filter(c => c.type == king);
    if (kings.length) {
      return kings.sort((c1, c2) => compareValues(c1.value, c2.value))[0];
    }
  }
  if (defaultSign) {
    const defaults = cards.filter(c => c.type == defaultSign);
    if (defaults.length) {
      return defaults.sort((c1, c2) => compareValues(c1.value, c2.value))[0];
    }
  }
  return cards[0];
}

export function compareValues(v1: number, v2: number): number {
  if (v1 == v2) return 0;

  if (v1 <= 3 && v2 <= 3) {
    return v2 - v1;
  }

  if (v1 > 3 && v2 > 3) {
    return v2 - v1;
  }

  return v1 <= 3 ? -1 : 1;
}

export function cardEquals(c1: Card, c2: Card): boolean {
  return c1.type == c2.type && c1.value == c2.value;
}

export function cardPoints(c1: Card): number {
  if (c1.value == 1) return 3;
  if (c1.value == 2 || c1.value == 3 || c1.value > 7) return 1;
  return 0;
}

export function pointsForTakes(takes: Card[]): number {
  const points = (takes || []).map(c => cardPoints(c)).reduce((a, b) => a + b, 0)
  return Math.floor(points / 3);
}

export function sortHand(hand: Card[]): Card[] {
  return hand.sort((c1, c2) => {
    if (c1.type > c2.type) return 1;
    if (c2.type > c1.type) return -1;
    return c1.value - c2.value;
  })
}
