import { Solar } from 'lunar-javascript';

const ANTHROPIC_MESSAGES_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL_ID = 'claude-sonnet-5-5';

const MODEL_INSTRUCTIONS = `Prepare a detailed but cautious, traditional BaZi cultural reading for an English-speaking customer. Write all customer-facing prose in English. Use Chinese terms such as 食神 when explaining the chart, followed by a clear English gloss. Do not recalculate, alter, or contradict the authoritative Four Pillars and chart structure supplied by the user message; a deterministic calendar library has already computed them.

Use the supplied Gregorian birth date, local birth time when provided, birthplace, IANA time zone, and optional gender. Gender is optional background for traditional interpretive conventions only; never infer or assume it. Calculate the Four Pillars using solar-term boundaries for the year and month pillars. Apply principles associated with Di Tian Sui (滴天髓) by reading the Day Master in relation to season, roots, support, and interactions rather than merely counting elements. Apply seasonal climate adjustment (调候) by considering cold/heat and dryness/dampness of the birth month. Do not equate a missing element with a useful element.

Return only one valid JSON object, no markdown. Use English prose. Schema:
{
  "pillars": {"year":"two Chinese characters","month":"two Chinese characters","day":"two Chinese characters","hour":"two Chinese characters or null"},
  "dayMaster":"English stem name and element, for example Ji (Yin Earth), or null",
  "season":"birth month/solar-term season, or null",
  "seasonalClimate":"brief explanation, or null",
  "elementFocus":"one of Wood, Fire, Earth, Metal, Water, Mixed, or null",
  "themes": {
    "overview":"2-3 cautious sentences",
    "personality":"one or two sentences",
    "relationships":"one or two sentences",
    "careerAndMoney":"one or two sentences",
    "familyAndFriends":"one or two sentences",
    "growthFocus":"one or two sentences"
  },
  "conclusion":"two or three concise English sentences bringing the chart together",
  "elementDiagnosis":{"absentElements":["truly absent from the full chart, if any"],"lowerElements":["relatively low representation"],"supportiveElements":["elements supported by overall chart balance"],"rationale":"distinguish low representation from supportive elements"},
  "beadRecommendation":{"element":"recommended element or null","materials":["up to 3 bead materials"],"colours":["up to 3 colours"],"rationale":"why these pieces fit the symbolic reading"},
  "lifestyleAdvice":{"wearing":"clothing and colour suggestion","food":"ordinary food or meal-pattern suggestion; not health treatment","relationships":"friendship and communication suggestion","decisions":"practical approach to work and everyday decisions"},
  "elementBalance":[{"element":"Wood|Fire|Earth|Metal|Water","score":0,"note":"up to 12 English words"}],
  "luckCycles":[{"period":"for example 2026–2035","score":1,"theme":"up to 24 English words","supportiveElement":"English element or null"}],
  "annualOutlook":[{"year":2026,"score":1,"theme":"up to 20 English words","opportunity":"up to 8 words","caution":"up to 8 words"}],
  "monthlyOutlook":[{"month":"January","score":1,"theme":"up to 14 English words"}],
  "status":"aligned or needs_review",
  "sharedTakeaways":["up to 3 concise key reflections"],
  "materialSuggestions":["up to 3 symbolic colour/material suggestions"],
  "message":"short customer-facing note"
}

Provide exactly five elementBalance entries with scores from 0 to 100 that sum to 100. Scores are a relative symbolic distribution of visible and hidden chart elements, not scientific measurements. Provide up to three luckCycles; only calculate start periods when the supplied date, gender, and time zone support a cautious estimate, otherwise label periods approximate. Provide exactly five annualOutlook entries for the current calendar year and next four years, and exactly twelve monthlyOutlook entries for the current calendar year. Use the concise word limits in the schema. Scores are reflective traditional outlook ratings from 1 (more challenging) to 5 (more supportive), not probabilities or guarantees; use balanced language and never call a month objectively lucky or unlucky. Treat every interpretation as one school's cultural reading for reflection. Never claim that a chart, bead, colour, sound or ritual causes luck, protection, healing, energy changes, relationship outcomes, financial success or other real-world results. Avoid certainty about future events, supernatural claims and health advice; food suggestions must be ordinary lifestyle ideas, not diets or treatment. Write all prose in English; use Chinese characters only for the four pillar values, and provide Day Master in English transliteration. Do not invent precision. Verify pillars against solar-term boundaries and ensure internal consistency. The provided birth time is aligned to one traditional double-hour period; use it for the hour pillar. If a core pillar cannot be determined reliably, set status to needs_review, leave themes empty, and ask the customer to check their details. Do not identify enemies or give investment instructions.`;

function badRequest(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

export function validateBirthDetails(input) {
  if (!input || typeof input !== 'object') throw badRequest('Enter your birth details to continue.');
  const { birthDate, birthTime = '', birthplace = '', timeZone = '', gender = 'prefer_not_to_say' } = input;
  if (typeof birthDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    throw badRequest('Enter a valid date of birth.');
  }
  const parsedDate = new Date(`${birthDate}T00:00:00Z`);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== birthDate || parsedDate > new Date()) {
    throw badRequest('Enter a valid date of birth.');
  }
  if (birthTime && (typeof birthTime !== 'string' || !/^([01]\d|2[0-3]):00$/.test(birthTime))) {
    throw badRequest('Choose a two-hour birth-time range or skip it.');
  }
  if (birthTime && Number(birthTime.slice(0, 2)) % 2 !== 1) {
    throw badRequest('Choose one complete traditional two-hour period or skip the birth time.');
  }
  if (typeof birthplace !== 'string' || birthplace.length > 140) throw badRequest('Birthplace must be 140 characters or fewer.');
  if (typeof timeZone !== 'string' || timeZone.length > 80) throw badRequest('Choose a valid time zone.');
  if (!['female', 'male', 'prefer_not_to_say'].includes(gender)) throw badRequest('Choose a valid gender option.');
  try { new Intl.DateTimeFormat('en', { timeZone }).format(parsedDate); }
  catch { throw badRequest('Choose a valid time zone.'); }
  return {
    birthDate,
    birthTime,
    birthplace: birthplace.trim(),
    timeZone,
    gender,
  };
}

function parseJsonObject(text, modelId) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error(`${modelId} returned an invalid response.`);
  try { return JSON.parse(text.slice(start, end + 1)); }
  catch { throw new Error(`${modelId} returned an invalid response.`); }
}

const STEM_ENGLISH = {
  '甲': 'Jia (Yang Wood)', '乙': 'Yi (Yin Wood)', '丙': 'Bing (Yang Fire)', '丁': 'Ding (Yin Fire)', '戊': 'Wu (Yang Earth)',
  '己': 'Ji (Yin Earth)', '庚': 'Geng (Yang Metal)', '辛': 'Xin (Yin Metal)', '壬': 'Ren (Yang Water)', '癸': 'Gui (Yin Water)',
};

const FIVE_ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
const ELEMENT_STYLE = {
  Wood: { materials: ['wood beads', 'natural seed beads'], colours: ['green', 'teal'], note: 'A wood-themed styling direction based on visible and hidden stems.' },
  Fire: { materials: ['warm-toned beads', 'natural stone beads'], colours: ['red', 'coral', 'amber tones'], note: 'A fire-themed styling direction based on visible and hidden stems.' },
  Earth: { materials: ['earth-toned beads', 'natural stone beads'], colours: ['ochre', 'sand', 'brown'], note: 'An earth-themed styling direction based on visible and hidden stems.' },
  Metal: { materials: ['light-toned beads', 'simple metal accents'], colours: ['white', 'silver', 'pale grey'], note: 'A metal-themed styling direction based on visible and hidden stems.' },
  Water: { materials: ['dark-toned beads', 'natural stone beads'], colours: ['black', 'navy', 'deep blue'], note: 'A water-themed styling direction based on visible and hidden stems.' },
};

function deriveElementProfile(chartStructure) {
  const counts = Object.fromEntries(FIVE_ELEMENTS.map((element) => [element, 0]));
  for (const pillar of Object.values(chartStructure || {})) {
    if (!pillar) continue;
    for (const stem of [pillar.stem, ...(pillar.hiddenStems || [])]) {
      const element = STEM_ENGLISH[stem]?.match(/\((?:Yang|Yin) (Wood|Fire|Earth|Metal|Water)\)/)?.[1];
      if (element) counts[element] += 1;
    }
  }

  const absentElements = FIVE_ELEMENTS.filter((element) => counts[element] === 0);
  const lowestCount = Math.min(...FIVE_ELEMENTS.map((element) => counts[element]));
  const lowerElements = FIVE_ELEMENTS.filter((element) => counts[element] === lowestCount && lowestCount > 0);
  // Stable tie-break: use the fixed Five Element order whenever several are absent or tied.
  const recommendedElement = absentElements[0] || lowerElements[0] || FIVE_ELEMENTS[0];
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0) || 1;
  const rawScores = FIVE_ELEMENTS.map((element) => (counts[element] / total) * 100);
  const scores = rawScores.map(Math.floor);
  let remainder = 100 - scores.reduce((sum, score) => sum + score, 0);
  const remainderOrder = rawScores.map((score, index) => ({ index, fraction: score - Math.floor(score) }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index);
  for (let index = 0; index < remainder; index += 1) scores[remainderOrder[index].index] += 1;

  return {
    counts,
    absentElements,
    lowerElements,
    recommendedElement,
    elementBalance: FIVE_ELEMENTS.map((element, index) => ({
      element,
      score: scores[index],
      note: `${counts[element]} of ${total} counted visible and hidden stems.`,
    })),
  };
}

function asList(value) {
  return Array.isArray(value) ? value.map(String) : String(value ?? '').split(',').map((item) => item.trim()).filter(Boolean);
}

function calculateFourPillars(details) {
  const [year, month, day] = details.birthDate.split('-').map(Number);
  const startHour = details.birthTime ? Number(details.birthTime.slice(0, 2)) : 12;
  // Use the interval midpoint; for the Rat hour, 23:30 remains on the selected local date.
  const representativeHour = details.birthTime ? (startHour === 23 ? 23 : startHour + 1) : 12;
  const representativeMinute = details.birthTime && startHour === 23 ? 30 : 0;
  const solar = Solar.fromYmdHms(year, month, day, representativeHour, representativeMinute, 0);
  const eightChar = solar.getLunar().getEightChar();
  const pillarData = {
    year: ['Year', eightChar.getYear()],
    month: ['Month', eightChar.getMonth()],
    day: ['Day', eightChar.getDay()],
    hour: ['Time', details.birthTime ? eightChar.getTime() : null],
  };
  const chartStructure = Object.fromEntries(Object.entries(pillarData).map(([key, [method, pillar]]) => {
    if (!pillar) return [key, null];
    const stemBranch = [...pillar];
    return [key, {
      stem: stemBranch[0],
      branch: stemBranch[1],
      hiddenStems: asList(eightChar[`get${method}HideGan`]()),
      visibleTenGod: eightChar[`get${method}ShiShenGan`](),
      hiddenTenGods: asList(eightChar[`get${method}ShiShenZhi`]()),
    }];
  }));
  return {
    pillars: {
      year: eightChar.getYear(),
      month: eightChar.getMonth(),
      day: eightChar.getDay(),
      hour: details.birthTime ? eightChar.getTime() : null,
    },
    dayMaster: STEM_ENGLISH[eightChar.getDayGan()] || null,
    chartStructure,
  };
}

async function askClaude({ apiKey, model, system, user, outputTokens }) {
  const response = await fetch(ANTHROPIC_MESSAGES_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      system,
      messages: [{ role: 'user', content: user }],
      max_tokens: outputTokens,
      output_config: { effort: 'medium' },
    }),
    signal: AbortSignal.timeout(180000),
  });
  if (!response.ok) {
    // Do not relay provider bodies; they can contain internal request details.
    throw new Error(`Anthropic API request failed (${response.status}) for ${model}.`);
  }
  const payload = await response.json();
  const content = payload?.content;
  const text = Array.isArray(content) ? content.filter((part) => part?.type === 'text').map((part) => part.text || '').join('\n') : '';
  if (typeof text !== 'string' || !text.trim()) {
    const stopReason = payload?.stop_reason || 'unknown';
    const usage = payload?.usage?.output_tokens;
    throw new Error(`${model} returned no text (stop_reason=${stopReason}, output_tokens=${usage ?? 'unknown'}).`);
  }
  return parseJsonObject(text, model);
}

function rangeFitsOneTraditionalHour(startTime) {
  if (!startTime) return false;
  const startHour = Number(startTime.slice(0, 2));
  // Traditional double-hours start at 23:00, then every two hours.
  return startHour % 2 === 1;
}

function blankThemes() {
  return { overview: '', personality: '', relationships: '', careerAndMoney: '', familyAndFriends: '', growthFocus: '' };
}

function customerEnglish(value, limit = 1200) {
  const translations = {
    '甲': 'Jia', '乙': 'Yi', '丙': 'Bing', '丁': 'Ding', '戊': 'Wu', '己': 'Ji', '庚': 'Geng', '辛': 'Xin', '壬': 'Ren', '癸': 'Gui',
    '子': 'Zi', '丑': 'Chou', '寅': 'Yin', '卯': 'Mao', '辰': 'Chen', '巳': 'Si', '午': 'Wu', '未': 'Wei', '申': 'Shen', '酉': 'You', '戌': 'Xu', '亥': 'Hai',
    '滴天髓': 'Di Tian Sui', '调候': 'seasonal climate adjustment', '五行': 'Five Elements',
    '食神': 'Eating God', '伤官': 'Hurting Officer', '偏财': 'Indirect Wealth', '正财': 'Direct Wealth', '七杀': 'Seven Killings',
    '正官': 'Direct Officer', '偏印': 'Indirect Resource', '正印': 'Direct Resource', '比肩': 'Friend', '劫财': 'Rob Wealth', '日主': 'Day Master',
    '清明': 'Clear and Bright', '立夏': 'Start of Summer', '立春': 'Start of Spring', '雨水': 'Rain Water', '惊蛰': 'Awakening of Insects',
    '春分': 'Spring Equinox', '谷雨': 'Grain Rain', '小满': 'Grain Buds', '芒种': 'Grain in Ear', '夏至': 'Summer Solstice',
    '小暑': 'Minor Heat', '大暑': 'Major Heat', '立秋': 'Start of Autumn', '处暑': 'End of Heat', '白露': 'White Dew',
    '秋分': 'Autumn Equinox', '寒露': 'Cold Dew', '霜降': 'Frost Descent', '立冬': 'Start of Winter', '小雪': 'Minor Snow',
    '大雪': 'Major Snow', '冬至': 'Winter Solstice', '小寒': 'Minor Cold', '大寒': 'Major Cold',
  };
  let text = String(value ?? '');
  for (const [source, replacement] of Object.entries(translations)) text = text.replaceAll(source, replacement);
  return text.replace(/\(\s*\)/g, '').replace(/\s{2,}/g, ' ').replace(/[\u3400-\u9FFF]/g, '').slice(0, limit);
}

function reviewResult(authoritativeChart = null) {
  return {
    status: 'needs_review',
    pillars: authoritativeChart?.pillars || { year: null, month: null, day: null, hour: null },
    chartStructure: authoritativeChart?.chartStructure || { year: null, month: null, day: null, hour: null },
    dayMaster: authoritativeChart?.dayMaster || null,
    season: null,
    seasonalClimate: '',
    elementFocus: null,
    conclusion: '',
    elementDiagnosis: { absentElements: [], lowerElements: [], supportiveElements: [], rationale: '' },
    beadRecommendation: { element: null, materials: [], colours: [], rationale: '' },
    lifestyleAdvice: { wearing: '', food: '', relationships: '', decisions: '' },
    elementBalance: [],
    luckCycles: [],
    annualOutlook: [],
    monthlyOutlook: [],
    themes: blankThemes(),
    sharedTakeaways: [],
    materialSuggestions: [],
    message: 'We could not confirm a consistent chart from these birth details. Please double-check the date, time, birthplace and time zone, then try again.',
  };
}

function sanitizeReading(result, authoritativeChart) {
  if (!result || result.status !== 'aligned') return reviewResult(authoritativeChart);
  const themes = result.themes && typeof result.themes === 'object' ? result.themes : {};
  if (!themes.overview || !themes.personality || !themes.relationships || !themes.careerAndMoney || !themes.familyAndFriends || !themes.growthFocus) return reviewResult(authoritativeChart);
  const profile = deriveElementProfile(authoritativeChart.chartStructure);
  const elementBalance = profile.elementBalance;
  const list = (value, limit, mapper) => Array.isArray(value) ? value.slice(0, limit).map(mapper) : [];
  const style = ELEMENT_STYLE[profile.recommendedElement];
  const advice = result.lifestyleAdvice || {};
  return {
    status: 'aligned',
    pillars: authoritativeChart.pillars,
    chartStructure: authoritativeChart.chartStructure,
    dayMaster: authoritativeChart.dayMaster,
    season: typeof result.season === 'string' ? customerEnglish(result.season, 180) : null,
    seasonalClimate: typeof result.seasonalClimate === 'string' ? customerEnglish(result.seasonalClimate) : '',
    elementFocus: profile.recommendedElement,
    conclusion: customerEnglish(result.conclusion, 800),
    elementDiagnosis: {
      absentElements: profile.absentElements,
      lowerElements: profile.lowerElements,
      supportiveElements: [profile.recommendedElement],
      rationale: `For consistent product styling, this guide counts visible and hidden stems in the supplied chart. ${profile.recommendedElement} is selected using a fixed rule: the first absent element in Wood, Fire, Earth, Metal, Water order; if none is absent, the first least-counted element. This is a cultural styling reference, not a classical useful-element determination.`,
    },
    beadRecommendation: {
      element: profile.recommendedElement,
      materials: style.materials,
      colours: style.colours,
      rationale: style.note,
    },
    lifestyleAdvice: {
      wearing: customerEnglish(advice.wearing, 320),
      food: customerEnglish(advice.food, 320),
      relationships: customerEnglish(advice.relationships, 320),
      decisions: customerEnglish(advice.decisions, 320),
    },
    elementBalance,
    luckCycles: list(result.luckCycles, 3, (item) => ({ period: customerEnglish(item.period, 40), score: Math.max(1, Math.min(5, Math.round(Number(item.score) || 1))), theme: customerEnglish(item.theme, 280), supportiveElement: typeof item.supportiveElement === 'string' ? customerEnglish(item.supportiveElement, 30) : null })),
    annualOutlook: list(result.annualOutlook, 5, (item) => ({ year: Number(item.year) || new Date().getFullYear(), score: Math.max(1, Math.min(5, Math.round(Number(item.score) || 1))), theme: customerEnglish(item.theme, 280), opportunity: customerEnglish(item.opportunity, 180), caution: customerEnglish(item.caution, 180) })),
    monthlyOutlook: list(result.monthlyOutlook, 12, (item) => ({ month: customerEnglish(item.month, 20), score: Math.max(1, Math.min(5, Math.round(Number(item.score) || 1))), theme: customerEnglish(item.theme, 220) })),
    themes: Object.fromEntries(Object.keys(blankThemes()).map((key) => [key, customerEnglish(themes[key])])),
    sharedTakeaways: Array.isArray(result.sharedTakeaways) ? result.sharedTakeaways.filter((item) => typeof item === 'string').slice(0, 3).map((item) => customerEnglish(item, 280)) : [],
    materialSuggestions: Array.isArray(result.materialSuggestions) ? result.materialSuggestions.filter((item) => typeof item === 'string').slice(0, 3).map((item) => customerEnglish(item, 180)) : [],
    message: 'A Claude-generated traditional cultural reading for reflection, not a guaranteed prediction.',
  };
}

export async function generateBaziReading(input, apiKey, modelConfig = {}) {
  if (!apiKey) throw badRequest('The reading service is not configured yet.', 503);
  const configuredModel = modelConfig.claude;
  const model = !configuredModel || configuredModel === 'anthropic/claude-sonnet-5.5'
    ? CLAUDE_MODEL_ID
    : configuredModel.replace(/^anthropic\//, '');
  const details = validateBirthDetails(input);
  const nextHour = details.birthTime ? String((Number(details.birthTime.slice(0, 2)) + 2) % 24).padStart(2, '0') : '';
  const birthTimeRange = details.birthTime ? `${details.birthTime}–${nextHour}:00` : 'not provided';
  const currentYear = new Date().getUTCFullYear();
  const authoritativeChart = calculateFourPillars(details);
  const profile = deriveElementProfile(authoritativeChart.chartStructure);
  const userPrompt = `Interpret these birth details using the authoritative chart structure below. The chart and all rule-derived fields are final: do not recalculate, alter, or replace any pillar, hidden stem, or Ten God. In particular, use the supplied Hidden Stems and Ten Gods exactly as given.\n\nGregorian date: ${details.birthDate}\nLocal birth-time range: ${birthTimeRange}\nBirthplace: ${details.birthplace || 'not provided'}\nIANA time zone at birth: ${details.timeZone}\nGender (optional): ${details.gender === 'prefer_not_to_say' ? 'not provided' : details.gender}\nCurrent calendar year for outlooks: ${currentYear}\n\nAuthoritative rule-calculated chart (lunar-javascript):\n${JSON.stringify(authoritativeChart, null, 2)}\n\nFixed product styling profile: ${JSON.stringify(profile)}. The backend exclusively chooses this styling element, its palette and matching products; do not substitute a different bead recommendation or claim this is a classical useful-element determination. The selected interval is one complete traditional two-hour period. If no interval was supplied, the authoritative hour pillar is null. Interpret this fixed chart with traditional Di Tian Sui and seasonal climate principles; explain reasoning from the actual Day Master, season, roots, and interactions. Provide cautious cultural interpretation and practical non-medical advice about clothing, ordinary food habits, friendships, and handling decisions. Describe Five Elements and BaZi as Chinese cultural heritage and the reading as a reference for personal reflection only. Never say that a product or element fixes a chart or causes luck, protection, health, energy, relationship, career or financial outcomes. Keep every customer-facing field in English except four pillar values. Do not frame lifestyle suggestions as treatment or guaranteed fate changes. Return the requested JSON only.`;

  const reading = await askClaude({ apiKey, model, system: MODEL_INSTRUCTIONS, user: userPrompt, outputTokens: 16000 });
  return sanitizeReading(reading, authoritativeChart);
}

export function publicError(error) {
  if (error?.status && error.status < 500) return { status: error.status, message: error.message };
  if (String(error?.message || '').includes('Anthropic API request failed (401)')) return { status: 502, message: 'The Claude API key could not authenticate. Check CLAUDE_API_KEY in the deployment environment.' };
  if (String(error?.message || '').includes('Anthropic API request failed (400)')) return { status: 502, message: 'Claude rejected the reading request format. Please try again later.' };
  if (String(error?.message || '').includes('Anthropic API request failed (403)')) return { status: 502, message: 'The Claude API key does not have access to this model. Check the key and model access in Anthropic Console.' };
  if (String(error?.message || '').includes('Anthropic API request failed (404)')) return { status: 502, message: 'The configured Claude model is not available. Check BAZI_CLAUDE_MODEL in the deployment environment.' };
  if (String(error?.message || '').includes('Anthropic API request failed (429)')) return { status: 503, message: 'Claude is busy or the API rate limit was reached. Please try again shortly.' };
  if (String(error?.message || '').includes('Anthropic API request failed (5')) return { status: 503, message: 'Claude is temporarily unavailable. Please try again shortly.' };
  return { status: 502, message: 'We could not complete your reading right now. Please try again shortly.' };
}
