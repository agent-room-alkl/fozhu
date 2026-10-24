import React, { useEffect, useRef, useState } from 'react';
import { BirthplaceSuggestion, searchBirthplaces } from '../utils/birthTimezone';

interface BirthDateFieldProps {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const inputClass = 'min-w-0 w-full rounded-md border border-[#ded4ca] bg-white px-1.5 py-2.5 text-[12px] font-normal normal-case tracking-normal text-[#321a0f] focus:outline-none focus:ring-2 focus:ring-[#E1BD7E] sm:px-2.5 sm:text-sm';

function splitDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? { year: match[1], month: String(Number(match[2])), day: String(Number(match[3])) } : { year: '', month: '', day: '' };
}

function composeDate(year: string, month: string, day: string) {
  if (!/^\d{4}$/.test(year) || !month || !day) return '';
  const numericYear = Number(year);
  const numericMonth = Number(month);
  const numericDay = Number(day);
  const date = new Date(Date.UTC(numericYear, numericMonth - 1, numericDay));
  if (date.getUTCFullYear() !== numericYear || date.getUTCMonth() !== numericMonth - 1 || date.getUTCDate() !== numericDay) return '';
  const today = new Date();
  const todayUtc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  if (date > todayUtc) return '';
  return `${year}-${String(numericMonth).padStart(2, '0')}-${String(numericDay).padStart(2, '0')}`;
}

export function BirthDateField({ value, onChange, compact = false }: BirthDateFieldProps) {
  const parts = splitDate(value);
  const [year, setYear] = useState(parts.year);
  const [month, setMonth] = useState(parts.month);
  const [day, setDay] = useState(parts.day);
  const lastEmittedValue = useRef(value);

  useEffect(() => {
    if (value === lastEmittedValue.current) return;
    const next = splitDate(value);
    setYear(next.year);
    setMonth(next.month);
    setDay(next.day);
    lastEmittedValue.current = value;
  }, [value]);

  const update = (nextYear: string, nextMonth: string, nextDay: string) => {
    setYear(nextYear);
    setMonth(nextMonth);
    setDay(nextDay);
    const nextValue = composeDate(nextYear, nextMonth, nextDay);
    lastEmittedValue.current = nextValue;
    onChange(nextValue);
  };

  const now = new Date();
  const yearNumber = Number(year);
  const monthNumber = Number(month);
  const currentYear = now.getFullYear();
  const maxDay = year && month ? new Date(yearNumber, monthNumber, 0).getDate() : 31;
  const dayLimit = yearNumber === currentYear && monthNumber === now.getMonth() + 1 ? now.getDate() : maxDay;
  const fieldClass = compact
    ? 'mt-1.5 min-w-0 w-full rounded-md border border-[#ded4ca] bg-white px-1 py-2.5 text-[12px] font-normal normal-case tracking-normal text-[#321a0f] focus:outline-none focus:ring-2 focus:ring-[#E1BD7E] sm:px-2 sm:text-sm'
    : 'mt-2 w-full rounded-lg border border-[#d8cec4] bg-[#FAF8F5] px-2.5 py-3 text-sm text-[#321a0f] focus:outline-none focus:ring-2 focus:ring-[#E1BD7E]';

  return <div className="grid min-w-0 grid-cols-[1.05fr_1fr_0.9fr] gap-1 sm:grid-cols-[1.2fr_1fr_0.8fr] sm:gap-2">
    <label className="block text-[10px] font-semibold text-[#675a51]">Year
      <input aria-label="Birth year" type="number" inputMode="numeric" autoComplete="bday-year" min="1800" max={currentYear} step="1" placeholder="1983" value={year} onChange={(event) => update(event.target.value.slice(0, 4), month, day)} className={fieldClass} required />
    </label>
    <label className="block text-[10px] font-semibold text-[#675a51]">Month
      <select aria-label="Birth month" autoComplete="bday-month" value={month} onChange={(event) => update(year, event.target.value, day)} className={fieldClass} required>
        <option value="">Month</option>{MONTHS.map((name, index) => <option key={name} value={String(index + 1)} disabled={yearNumber === currentYear && index + 1 > now.getMonth() + 1}>{String(index + 1).padStart(2, '0')} · {name}</option>)}
      </select>
    </label>
    <label className="block text-[10px] font-semibold text-[#675a51]">Day
      <select aria-label="Birth day" autoComplete="bday-day" value={day} onChange={(event) => update(year, month, event.target.value)} className={fieldClass} required>
        <option value="">Day</option>{Array.from({ length: dayLimit }, (_, index) => <option key={index + 1} value={String(index + 1)}>{String(index + 1).padStart(2, '0')}</option>)}
      </select>
    </label>
  </div>;
}

interface BirthplaceAutocompleteProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (place: BirthplaceSuggestion) => void;
  placeholder: string;
  className: string;
  leadingIcon?: boolean;
}

export function BirthplaceAutocomplete({ id, value, onChange, onSelect, placeholder, className, leadingIcon = false }: BirthplaceAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<BirthplaceSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    if (value.trim().length < 2 || value === selectedLocation) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }
    const controller = new AbortController();
    setIsSearching(true);
    const timeout = window.setTimeout(() => {
      void searchBirthplaces(value, controller.signal).then((matches) => {
        if (!controller.signal.aborted) {
          setSuggestions(matches);
          setIsSearching(false);
        }
      });
    }, 250);
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [value, selectedLocation]);

  return <div className="relative">
    {leadingIcon && <span aria-hidden="true" className="material-symbols-outlined absolute left-2.5 top-1/2 z-10 -translate-y-1/2 text-sm leading-none text-[#9a8875]">location_on</span>}
    <input id={id} type="text" role="combobox" aria-autocomplete="list" aria-expanded={isOpen && suggestions.length > 0} aria-controls={`${id}-suggestions`} autoComplete="off" value={value} onFocus={() => setIsOpen(true)} onBlur={() => window.setTimeout(() => setIsOpen(false), 120)} onChange={(event) => { setSelectedLocation(''); onChange(event.target.value); setIsOpen(true); }} placeholder={placeholder} className={`${className} ${leadingIcon ? 'pl-8' : ''}`} />
    {isOpen && (isSearching || suggestions.length > 0) && <div id={`${id}-suggestions`} role="listbox" className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-[#ded4ca] bg-white py-1 shadow-xl">
      {isSearching && <p className="px-3 py-2 text-xs text-[#82746f]">Searching cities…</p>}
      {!isSearching && suggestions.map((place) => <button key={`${place.location}-${place.timeZone}`} type="button" role="option" aria-selected="false" onMouseDown={(event) => event.preventDefault()} onClick={() => { setSelectedLocation(place.location); setSuggestions([]); setIsOpen(false); onSelect(place); }} className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-[#321a0f] hover:bg-[#F7F3EF] focus:bg-[#F7F3EF] focus:outline-none">
        <span aria-hidden="true" className="material-symbols-outlined text-base text-[#8a6740]">location_on</span><span>{place.city}, {place.country}</span>
      </button>)}
    </div>}
  </div>;
}
