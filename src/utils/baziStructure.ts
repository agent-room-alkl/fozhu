export interface HeavenlyStem {
  char: string;
  pinyin: string;
  element: string;
  polarity: 'Yang' | 'Yin';
}

export const HEAVENLY_STEMS: Record<string, HeavenlyStem> = {
  '甲': { char: '甲', pinyin: 'Jia', element: 'Wood', polarity: 'Yang' },
  '乙': { char: '乙', pinyin: 'Yi', element: 'Wood', polarity: 'Yin' },
  '丙': { char: '丙', pinyin: 'Bing', element: 'Fire', polarity: 'Yang' },
  '丁': { char: '丁', pinyin: 'Ding', element: 'Fire', polarity: 'Yin' },
  '戊': { char: '戊', pinyin: 'Wu', element: 'Earth', polarity: 'Yang' },
  '己': { char: '己', pinyin: 'Ji', element: 'Earth', polarity: 'Yin' },
  '庚': { char: '庚', pinyin: 'Geng', element: 'Metal', polarity: 'Yang' },
  '辛': { char: '辛', pinyin: 'Xin', element: 'Metal', polarity: 'Yin' },
  '壬': { char: '壬', pinyin: 'Ren', element: 'Water', polarity: 'Yang' },
  '癸': { char: '癸', pinyin: 'Gui', element: 'Water', polarity: 'Yin' },
};

export const EARTHLY_BRANCHES: Record<string, { pinyin: string; animal: string; hiddenStems: string[] }> = {
  '子': { pinyin: 'Zi', animal: 'Rat', hiddenStems: ['癸'] },
  '丑': { pinyin: 'Chou', animal: 'Ox', hiddenStems: ['己', '癸', '辛'] },
  '寅': { pinyin: 'Yin', animal: 'Tiger', hiddenStems: ['甲', '丙', '戊'] },
  '卯': { pinyin: 'Mao', animal: 'Rabbit', hiddenStems: ['乙'] },
  '辰': { pinyin: 'Chen', animal: 'Dragon', hiddenStems: ['戊', '乙', '癸'] },
  '巳': { pinyin: 'Si', animal: 'Snake', hiddenStems: ['丙', '戊', '庚'] },
  '午': { pinyin: 'Wu', animal: 'Horse', hiddenStems: ['丁', '己'] },
  '未': { pinyin: 'Wei', animal: 'Goat', hiddenStems: ['己', '丁', '乙'] },
  '申': { pinyin: 'Shen', animal: 'Monkey', hiddenStems: ['庚', '壬', '戊'] },
  '酉': { pinyin: 'You', animal: 'Rooster', hiddenStems: ['辛'] },
  '戌': { pinyin: 'Xu', animal: 'Dog', hiddenStems: ['戊', '辛', '丁'] },
  '亥': { pinyin: 'Hai', animal: 'Pig', hiddenStems: ['壬', '甲'] },
};

export const TEN_GOD_ENGLISH: Record<string, string> = {
  '比肩': 'Friend', '劫财': 'Rob Wealth', '食神': 'Eating God', '伤官': 'Hurting Officer',
  '偏财': 'Indirect Wealth', '正财': 'Direct Wealth', '七杀': 'Seven Killings', '正官': 'Direct Officer',
  '偏印': 'Indirect Resource', '正印': 'Direct Resource',
};

const GENERATES: Record<string, string> = { Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood' };
const CONTROLS: Record<string, string> = { Wood: 'Earth', Earth: 'Water', Water: 'Fire', Fire: 'Metal', Metal: 'Wood' };

export function tenGod(dayMasterChar: string, otherChar: string) {
  const day = HEAVENLY_STEMS[dayMasterChar];
  const other = HEAVENLY_STEMS[otherChar];
  if (!day || !other) return null;
  const samePolarity = day.polarity === other.polarity;
  if (day.element === other.element) return samePolarity ? '比肩' : '劫财';
  if (GENERATES[day.element] === other.element) return samePolarity ? '食神' : '伤官';
  if (CONTROLS[day.element] === other.element) return samePolarity ? '偏财' : '正财';
  if (CONTROLS[other.element] === day.element) return samePolarity ? '七杀' : '正官';
  if (GENERATES[other.element] === day.element) return samePolarity ? '偏印' : '正印';
  return null;
}
