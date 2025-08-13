import React, { useState, useRef, useEffect } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { Calendar, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { DateRangePickerProps, QuickRange } from '../../types/ui';
import 'react-day-picker/dist/style.css';
import { useLanguage } from '../../hooks/useLanguage';

const quickRanges: QuickRange[] = [
  {
    label: 'Today',
    getValue: () => ({
      from: startOfDay(new Date()),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: 'Yesterday',
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 1)),
      to: endOfDay(subDays(new Date(), 1)),
    }),
  },
  {
    label: 'Last 7 days',
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 6)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: 'Last 30 days',
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 29)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: 'Last 365 days',
    getValue: () => ({
      from: startOfDay(subDays(new Date(), 364)),
      to: endOfDay(new Date()),
    }),
  },
];

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onRangeChange,
  initialRange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(
    initialRange ? { from: initialRange.from || undefined, to: initialRange.to || undefined } : undefined
  );
  const [tempRange, setTempRange] = useState<DateRange | undefined>(selectedRange);
  const containerRef = useRef<HTMLDivElement>(null);
    const { t } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setTempRange(selectedRange);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedRange]);

  const handleQuickRangeSelect = (range: QuickRange) => {
    const { from, to } = range.getValue();
    const newRange = { from, to };
    setTempRange(newRange);
  };

  const handleApply = () => {
    setSelectedRange(tempRange);
    onRangeChange(tempRange?.from || null, tempRange?.to || null);
    setIsOpen(false);
  };

  const handleClear = () => {
    const clearedRange = undefined;
    setTempRange(clearedRange);
    setSelectedRange(clearedRange);
    onRangeChange(null, null);
    setIsOpen(false);
  };

  const formatDateRange = () => {
    if (!selectedRange?.from) return t('common.selectDateRange');
    if (!selectedRange.to) return format(selectedRange.from, 'MMM dd, yyyy');
    return `${format(selectedRange.from, 'MMM dd, yyyy')} - ${format(selectedRange.to, 'MMM dd, yyyy')}`;
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 min-w-[200px] justify-start"
      >
        <Calendar size={16} />
        <span className="truncate">{formatDateRange()}</span>
      </Button>

      {/* Date Picker Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4 min-w-[320px] md:min-w-[400px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">{t('common.selectDateRange')}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-1"
              >
                <X size={16} />
              </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {/* Quick Range Buttons */}
              <div className="flex flex-col space-y-2 md:w-40">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Quick Select</h4>
                {quickRanges.map((range) => (
                  <Button
                    key={range.label}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickRangeSelect(range)}
                    className="justify-start text-left text-sm py-2 px-3 hover:bg-blue-50 hover:text-blue-700"
                  >
                    {range.label}
                  </Button>
                ))}
              </div>

              {/* Calendar */}
              <div className="flex-1">
                <style dangerouslySetInnerHTML={{
                  __html: `
                    .rdp {
                      --rdp-cell-size: 32px;
                      --rdp-accent-color: #3b82f6;
                      --rdp-background-color: #eff6ff;
                      margin: 0;
                    }
                    .rdp-day_selected {
                      background-color: var(--rdp-accent-color);
                      color: white;
                    }
                    .rdp-day_selected:hover {
                      background-color: #2563eb;
                    }
                    .rdp-day_range_middle {
                      background-color: var(--rdp-background-color);
                      color: var(--rdp-accent-color);
                    }
                    .rdp-day_range_start,
                    .rdp-day_range_end {
                      background-color: var(--rdp-accent-color);
                      color: white;
                    }
                    .rdp-day:hover {
                      background-color: #f3f4f6;
                    }
                    .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
                      background-color: #f3f4f6;
                    }
                  `
                }} />
                <DayPicker
                  mode="range"
                  selected={tempRange}
                  onSelect={setTempRange}
                  numberOfMonths={1}
                  showOutsideDays
                  className="rdp-custom"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="text-gray-600 hover:text-gray-800"
              >
                Clear
              </Button>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsOpen(false);
                    setTempRange(selectedRange);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleApply}
                  className="flex items-center space-x-1"
                >
                  <Check size={16} />
                  <span>Apply</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};