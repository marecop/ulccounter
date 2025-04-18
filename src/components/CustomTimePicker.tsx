import React, { useState, useEffect } from 'react';

interface CustomTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({ value, onChange, className = '' }) => {
  // 解析傳入的時間值
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);

  useEffect(() => {
    // 當外部 value 改變時更新內部狀態
    if (value) {
      const [h, m] = value.split(':').map(Number);
      setHours(h || 0);
      setMinutes(m || 0);
    }
  }, [value]);

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHours = parseInt(e.target.value, 10);
    setHours(newHours);
    // 更新外部值
    onChange(`${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMinutes = parseInt(e.target.value, 10);
    setMinutes(newMinutes);
    // 更新外部值
    onChange(`${hours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`);
  };

  // 生成小時選項 (0-23)
  const hourOptions = Array.from({ length: 24 }, (_, i) => (
    <option key={`hour-${i}`} value={i}>
      {i.toString().padStart(2, '0')}
    </option>
  ));

  // 生成分鐘選項 (0-59)
  const minuteOptions = Array.from({ length: 60 }, (_, i) => (
    <option key={`minute-${i}`} value={i}>
      {i.toString().padStart(2, '0')}
    </option>
  ));

  return (
    <div className={`flex gap-2 custom-time-picker ${className}`}>
      <div className="w-1/2">
        <label className="block text-xs text-gray-500 mb-1">Hrs</label>
        <select
          value={hours}
          onChange={handleHourChange}
          className="w-full"
        >
          {hourOptions}
        </select>
      </div>
      <div className="w-1/2">
        <label className="block text-xs text-gray-500 mb-1">Mins</label>
        <select
          value={minutes}
          onChange={handleMinuteChange}
          className="w-full"
        >
          {minuteOptions}
        </select>
      </div>
    </div>
  );
};

export default CustomTimePicker; 