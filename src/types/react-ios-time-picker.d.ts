declare module 'react-ios-time-picker' {
  export interface TimePickerProps {
    value?: string;
    onChange: (value: string) => void;
    use24hours?: boolean;
    placeholder?: string;
    cellHeight?: number;
    fontSize?: number;
    pickerDefaultValue?: string;
    cancelButtonText?: string;
    doneButtonText?: string;
    height?: number | string;
    width?: number | string;
    style?: React.CSSProperties;
    disabled?: boolean;
  }

  const TimePicker: React.FC<TimePickerProps>;
  export default TimePicker;
} 