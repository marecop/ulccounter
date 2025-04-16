import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ExamBoard, ExamInfo, Subject } from '@/types';
import { subjects, venues } from '@/data/subjects';

interface ExamFormProps {
  onSubmit: (examInfo: ExamInfo) => void;
}

export default function ExamForm({ onSubmit }: ExamFormProps) {
  const [board, setBoard] = useState<ExamBoard>('Cambridge');
  const [selectedSubject, setSelectedSubject] = useState<Subject>(subjects.Cambridge[0]);
  const [date, setDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [customVenue, setCustomVenue] = useState('');
  
  // 用於顯示的12小時制時間
  const [startTime12h, setStartTime12h] = useState('');
  const [endTime12h, setEndTime12h] = useState('');

  // 轉換24小時制時間到12小時制帶AM/PM
  const formatTimeTo12Hour = (time24: string): string => {
    if (!time24 || !time24.includes(':')) return '';
    
    const [hours24, minutes] = time24.split(':').map(Number);
    const period = hours24 >= 12 ? 'P.M.' : 'A.M.';
    const hours12 = hours24 % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // 當時間改變時更新12小時制顯示
  useEffect(() => {
    setStartTime12h(formatTimeTo12Hour(startTime));
    setEndTime12h(formatTimeTo12Hour(endTime));
  }, [startTime, endTime]);

  const handleBoardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBoard = e.target.value as ExamBoard;
    setBoard(newBoard);
    setSelectedSubject(subjects[newBoard][0]);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = subjects[board].find(subject => subject.code === e.target.value);
    if (selected) {
      setSelectedSubject(selected);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      board,
      subject: selectedSubject,
      date,
      startTime,
      endTime,
      venue: customVenue || venues[board]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-ulc-blue">Exam Setup</h2>
      
      <div className="grid gap-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="board">
              Examination Board
            </label>
            <select
              id="board"
              value={board}
              onChange={handleBoardChange}
              className="select w-full text-black font-medium"
            >
              <option value="Cambridge">Cambridge (CAIE)</option>
              <option value="Edexcel">Edexcel</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="venue">
              Venue Code
            </label>
            <div className="flex gap-2 items-center">
              <div className="bg-gray-200 px-3 py-2 rounded-md text-gray-700">
                {board === 'Cambridge' ? 'CAIE:' : 'Edexcel:'}
              </div>
              <input
                type="text"
                id="venue"
                value={customVenue || venues[board]}
                onChange={(e) => setCustomVenue(e.target.value)}
                className="input flex-grow text-black font-medium"
                placeholder={venues[board]}
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="subject">
              Subject
            </label>
            <select
              id="subject"
              value={selectedSubject.code}
              onChange={handleSubjectChange}
              className="select w-full text-black font-medium"
            >
              {subjects[board].map(subject => (
                <option key={subject.code} value={subject.code}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="subject-code">
              Subject Code
            </label>
            <input
              type="text"
              id="subject-code"
              value={selectedSubject.code}
              className="input w-full bg-gray-100 text-black font-medium"
              readOnly
            />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="date">
            Exam Date
          </label>
          <DatePicker
            id="date"
            selected={date}
            onChange={(date: Date) => setDate(date)}
            className="input w-full text-black font-medium"
            dateFormat="MMMM d, yyyy"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="start-time">
              Start Time
            </label>
            <div>
              <input
                type="time"
                id="start-time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="input w-full text-black font-medium"
              />
              {startTime12h && (
                <div className="mt-1 text-sm text-gray-600">
                  {startTime12h}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="end-time">
              End Time
            </label>
            <div>
              <input
                type="time"
                id="end-time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="input w-full text-black font-medium"
              />
              {endTime12h && (
                <div className="mt-1 text-sm text-gray-600">
                  {endTime12h}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <button
          type="submit"
          className="btn btn-primary px-8 py-3 text-lg"
        >
          Start Timer
        </button>
      </div>
    </form>
  );
} 