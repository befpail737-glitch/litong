'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';

interface FilterOption {
  id: string;
  label: string;
  count: number;
}

interface FilterGroup {
  key: string;
  label: string;
  options: FilterOption[];
}

const filterGroups: FilterGroup[] = [
  {
    key: 'category',
    label: '产品分类',
    options: [
      { id: 'microcontrollers', label: '微控制器', count: 2000 },
      { id: 'power-management', label: '电源管理', count: 1500 },
      { id: 'analog-mixed-signal', label: '模拟与混合信号', count: 3000 },
      { id: 'rf-wireless', label: 'RF与无线', count: 800 },
      { id: 'sensors', label: '传感器', count: 1200 },
      { id: 'interface-ics', label: '接口IC', count: 600 }
    ]
  },
  {
    key: 'brand',
    label: '品牌',
    options: [
      { id: 'stmicroelectronics', label: 'STMicroelectronics', count: 2000 },
      { id: 'texas-instruments', label: 'Texas Instruments', count: 1800 },
      { id: 'maxim-integrated', label: 'Maxim Integrated', count: 1200 },
      { id: 'infineon', label: 'Infineon', count: 1500 },
      { id: 'analog-devices', label: 'Analog Devices', count: 2500 },
      { id: 'espressif', label: 'Espressif', count: 100 }
    ]
  },
  {
    key: 'package',
    label: '封装',
    options: [
      { id: 'qfn', label: 'QFN', count: 1500 },
      { id: 'qfp', label: 'QFP', count: 1200 },
      { id: 'bga', label: 'BGA', count: 800 },
      { id: 'sop', label: 'SOP', count: 2000 },
      { id: 'tssop', label: 'TSSOP', count: 1000 },
      { id: 'wlcsp', label: 'WLCSP', count: 600 }
    ]
  },
  {
    key: 'voltage',
    label: '工作电压',
    options: [
      { id: '1.8v', label: '1.8V', count: 800 },
      { id: '3.3v', label: '3.3V', count: 2000 },
      { id: '5v', label: '5V', count: 1500 },
      { id: '12v', label: '12V', count: 600 },
      { id: '24v', label: '24V', count: 400 }
    ]
  }
];

export default function ProductsFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const urlSearchParams = useSearchParams();
  
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const filters: Record<string, string[]> = {};
    filterGroups.forEach(group => {
      const paramValue = urlSearchParams.get(group.key);
      if (paramValue) {
        filters[group.key] = [paramValue];
      }
    });
    setSelectedFilters(filters);
  }, [urlSearchParams]);

  const updateFilters = (groupKey: string, optionId: string, checked: boolean) => {
    const newFilters = { ...selectedFilters };
    
    if (!newFilters[groupKey]) {
      newFilters[groupKey] = [];
    }
    
    if (checked) {
      if (!newFilters[groupKey].includes(optionId)) {
        newFilters[groupKey].push(optionId);
      }
    } else {
      newFilters[groupKey] = newFilters[groupKey].filter(id => id !== optionId);
      if (newFilters[groupKey].length === 0) {
        delete newFilters[groupKey];
      }
    }
    
    setSelectedFilters(newFilters);
    
    // Update URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, values]) => {
      values.forEach(value => params.append(key, value));
    });
    
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newUrl);
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    router.push(pathname);
  };

  const getActiveFilterCount = () => {
    return Object.values(selectedFilters).reduce((total, filters) => total + filters.length, 0);
  };

  return (
    <div className="bg-white">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <span>筛选条件 {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}</span>
          <svg
            className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filters */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="space-y-6">
          {/* Active Filters */}
          {getActiveFilterCount() > 0 && (
            <div className="pb-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900">已选条件</h3>
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  清除全部
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(selectedFilters).map(([groupKey, values]) =>
                  values.map(value => {
                    const group = filterGroups.find(g => g.key === groupKey);
                    const option = group?.options.find(o => o.id === value);
                    return (
                      <span
                        key={`${groupKey}-${value}`}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {option?.label || value}
                        <button
                          onClick={() => updateFilters(groupKey, value, false)}
                          className="ml-2 text-primary-600 hover:text-primary-700"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Filter Groups */}
          {filterGroups.map((group) => (
            <div key={group.key} className="border-b border-gray-200 pb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">{group.label}</h3>
              <div className="space-y-3">
                {group.options.map((option) => (
                  <div key={option.id} className="flex items-center">
                    <input
                      id={`${group.key}-${option.id}`}
                      type="checkbox"
                      checked={selectedFilters[group.key]?.includes(option.id) || false}
                      onChange={(e) => updateFilters(group.key, option.id, e.target.checked)}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label
                      htmlFor={`${group.key}-${option.id}`}
                      className="ml-3 text-sm text-gray-600 cursor-pointer flex-1"
                    >
                      <span>{option.label}</span>
                      <span className="text-gray-400 ml-1">({option.count})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}