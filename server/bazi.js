import { Solar } from 'lunar-javascript';

const GATEWAY_URL = 'https://ai-gateway.vercel.sh/v1/chat/completions';
const CLAUDE_MODEL_ID = 'anthropic/claude-sonnet-5.5';

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
  "conclusion":"two or three concise English sentences bringing the chart together",
  "elementDiagnosis":{"absentElements":["truly absent from all stems, branches, and hidden stems, if any"],"lowerElements":["relatively low representation"],"supportiveElements":["elements supported by overall chart balance"],"rationale":"distinguish low representation from supportive elements"},
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

Provide exactly five elementBalance entries with scores from 0 to 100 that sum to 100. Scores are a relative symbolic distribution of visible and hidden chart elements, not scientific measurements. Provide up to three luckCycles; only calculate start periods when the supplied date, gender, and time zone support a cautious estimate, otherwise label periods approximate. Provide exactly five annualOutlook entries for the current calendar year and next four years, and exactly twelve monthlyOutlook entries for the current calendar year. Use the concise word limits in the schema. Scores are reflective traditional outlook ratings from 1 (more challenging) to 5 (more supportive), not probabilities or guarantees; use balanced language and never call a month objectively lucky or unlucky. Write all prose in English; use Chinese characters only for the four pillar values, and provide Day Master in English transliteration. Do not invent precision. Verify pillars against solar-term boundaries and ensure internal consistency. The provided birth time is aligned to one traditional double-hour period; use it for the hour pillar. If a core pillar cannot be determined reliably, set status to needs_review, leave themes empty, and ask the customer to check their details. Do not make guaranteed predictions, diagnose health, identify enemies, or give investment instructions. Frame interpretation as a traditional cultural perspective, not verified fact.`;

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

async function askGateway({ apiKey, model, system, user, outputTokens }) {
  const response = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      max_completion_tokens: outputTokens,
    }),
    signal: AbortSignal.timeout(180000),
  });
  if (!response.ok) {
    // Do not relay provider bodies; they can contain internal request details.
    throw new Error(`AI Gateway request failed (${response.status}) for ${model}.`);
  }
  const payload = await response.json();
  const choice = payload?.choices?.[0];
  const content = choice?.message?.content;
  const text = Array.isArray(content) ? content.map((part) => part.text || '').join('\n') : content;
  if (typeof text !== 'string' || !text.trim()) {
    const finishReason = choice?.finish_reason || 'unknown';
    const usage = payload?.usage?.completion_tokens;
    throw new Error(`${model} returned no text (finish_reason=${finishReason}, completion_tokens=${usage ?? 'unknown'}).`);
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
  const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water', 'Mixed'];
  const fiveElements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
  const elementBalance = Array.isArray(result.elementBalance) ? result.elementBalance
    .filter((item) => fiveElements.includes(item?.element) && Number.isFinite(item.score))
    .slice(0, 5)
    .map((item) => ({ element: item.element, score: Math.max(0, Math.min(100, Math.round(item.score))), note: String(item.note || '').slice(0, 220) })) : [];
  if (elementBalance.length !== 5) return reviewResult(authoritativeChart);
  const balanceTotal = elementBalance.reduce((sum, item) => sum + item.score, 0);
  if (balanceTotal < 95 || balanceTotal > 105) return reviewResult(authoritativeChart);
  const list = (value, limit, mapper) => Array.isArray(value) ? value.slice(0, limit).map(mapper) : [];
  const validFiveElement = (value) => fiveElements.includes(value);
  const diagnosis = result.elementDiagnosis || {};
  const recommendation = result.beadRecommendation || {};
  const advice = result.lifestyleAdvice || {};
  return {
    status: 'aligned',
    pillars: authoritativeChart.pillars,
    chartStructure: authoritativeChart.chartStructure,
    dayMaster: authoritativeChart.dayMaster,
    season: typeof result.season === 'string' ? customerEnglish(result.season, 180) : null,
    seasonalClimate: typeof result.seasonalClimate === 'string' ? customerEnglish(result.seasonalClimate) : '',
    elementFocus: elements.includes(result.elementFocus) ? result.elementFocus : null,
    conclusion: customerEnglish(result.conclusion, 800),
    elementDiagnosis: {
      absentElements: list(diagnosis.absentElements, 5, (value) => customerEnglish(value, 20)).filter(validFiveElement),
      lowerElements: list(diagnosis.lowerElements, 5, (value) => customerEnglish(value, 20)).filter(validFiveElement),
      supportiveElements: list(diagnosis.supportiveElements, 3, (value) => customerEnglish(value, 20)).filter(validFiveElement),
      rationale: customerEnglish(diagnosis.rationale, 500),
    },
    beadRecommendation: {
      element: validFiveElement(recommendation.element) ? recommendation.element : (elements.includes(result.elementFocus) ? result.elementFocus : null),
      materials: list(recommendation.materials, 3, (value) => customerEnglish(value, 100)),
      colours: list(recommendation.colours, 3, (value) => customerEnglish(value, 60)),
      rationale: customerEnglish(recommendation.rationale, 500),
    },
    lifestyleAdvice: {
      wearing: customerEnglish(advice.wearing, 320),
      food: customerEnglish(advice.food, 320),
      relationships: customerEnglish(advice.relationships, 320),
      decisions: customerEnglish(advice.decisions, 320),
    },
    elementBalance: elementBalance.map((item) => ({ ...item, note: customerEnglish(item.note, 220) })),
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
  const model = modelConfig.claude || CLAUDE_MODEL_ID;
  const details = validateBirthDetails(input);
  const nextHour = details.birthTime ? String((Number(details.birthTime.slice(0, 2)) + 2) % 24).padStart(2, '0') : '';
  const birthTimeRange = details.birthTime ? `${details.birthTime}–${nextHour}:00` : 'not provided';
  const currentYear = new Date().getUTCFullYear();
  const authoritativeChart = calculateFourPillars(details);
  const userPrompt = `Interpret these birth details using the authoritative chart structure below. The chart and all rule-derived fields are final: do not recalculate, alter, or replace any pillar, hidden stem, or Ten God. In particular, use the supplied Hidden Stems and Ten Gods exactly as given.\n\nGregorian date: ${details.birthDate}\nLocal birth-time range: ${birthTimeRange}\nBirthplace: ${details.birthplace || 'not provided'}\nIANA time zone at birth: ${details.timeZone}\nGender (optional): ${details.gender === 'prefer_not_to_say' ? 'not provided' : details.gender}\nCurrent calendar year for outlooks: ${currentYear}\n\nAuthoritative rule-calculated chart (lunar-javascript):\n${JSON.stringify(authoritativeChart, null, 2)}\n\nThe selected interval is one complete traditional two-hour period. If no interval was supplied, the authoritative hour pillar is null. Interpret this fixed chart with traditional Di Tian Sui and seasonal climate principles; explain reasoning from the actual Day Master, season, roots, and interactions. For the element diagnosis, separately identify truly absent elements and relatively low elements by examining all visible and hidden stems. Do not call the lowest percentage the useful element automatically. Name the element or elements that may be supportive based on season and chart balance. Add a concise overall conclusion, bead material and colour recommendations, and practical non-medical advice about clothing, food habits, friendships, and handling decisions. Keep every customer-facing field in English except four pillar values. Do not frame lifestyle suggestions as health treatment or guaranteed fate changes. Return the requested JSON only.`;

  const reading = await askGateway({ apiKey, model, system: MODEL_INSTRUCTIONS, user: userPrompt, outputTokens: 8000 });
  return sanitizeReading(reading, authoritativeChart);
}

export function publicError(error) {
  if (error?.status && error.status < 500) return { status: error.status, message: error.message };
  if (String(error?.message || '').includes('AI Gateway request failed (401)')) return { status: 502, message: 'The reading service could not authenticate. Please contact support.' };
  if (String(error?.message || '').includes('AI Gateway request failed (400)')) return { status: 502, message: 'The AI provider rejected the reading request format. Please try again later.' };
  if (String(error?.message || '').includes('AI Gateway request failed (403)') && String(error?.message || '').includes('anthropic/claude-sonnet-5.5')) return { status: 502, message: 'Claude Sonnet 5.5 is blocked by your Vercel team model allowlist. A team owner must enable it in AI Gateway Settings before readings can run.' };
  if (String(error?.message || '').includes('AI Gateway request failed (403)')) return { status: 502, message: 'The reading service cannot access one or more AI models. Please check model access and provider setup in Vercel AI Gateway.' };
  if (String(error?.message || '').includes('AI Gateway request failed (404)')) return { status: 502, message: 'A requested AI model is not available through this Gateway configuration.' };
  if (String(error?.message || '').includes('AI Gateway request failed (429)')) return { status: 503, message: 'The reading service is busy. Please try again shortly.' };
  return { status: 502, message: 'We could not complete your reading right now. Please try again shortly.' };
}
