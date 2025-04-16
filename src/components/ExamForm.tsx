import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ExamBoard, ExamInfo, Subject, Teacher } from '@/types';
import { subjects, centreNumbers } from '@/data/subjects';

interface ExamFormProps {
  onSubmit: (examInfo: ExamInfo) => void;
  initialData?: ExamInfo | null;
}

export default function ExamForm({ onSubmit, initialData }: ExamFormProps) {
  const [board, setBoard] = useState<ExamBoard>(initialData?.board || 'Cambridge');
  const [selectedSubject, setSelectedSubject] = useState<Subject>(
    initialData?.subject || subjects.Cambridge[0]
  );
  const [date, setDate] = useState<Date>(initialData?.date || new Date());
  const [startTime, setStartTime] = useState(initialData?.startTime || '09:00');
  const [endTime, setEndTime] = useState(initialData?.endTime || '11:00');
  const [customVenue, setCustomVenue] = useState(initialData?.venue || '');
  const [showAdditionalSettings, setShowAdditionalSettings] = useState(!!initialData);
  
  // 額外設置
  const [classroom, setClassroom] = useState(initialData?.classroom || '');
  const [teachers, setTeachers] = useState<Teacher[]>(
    initialData?.teachers?.length ? initialData.teachers : [{ name: '', time: '' }]
  );
  const [todayDate, setTodayDate] = useState<Date>(initialData?.todayDate || new Date());
  const [attendanceFile, setAttendanceFile] = useState<File | null>(initialData?.attendanceFile || null);
  
  // 教室選項
  const [classrooms] = useState<string[]>([]);

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

  const handleTimeChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    // 直接設置值，允許用戶輸入
    setter(value);
    
    // 如果值符合格式要求，則標準化格式
    const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (timeRegex.test(value)) {
      // 標準化格式為 HH:MM
      const [hours, minutes] = value.split(':').map(Number);
      setter(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
    }
  };

  const addTeacher = () => {
    setTeachers([...teachers, { name: '', time: '' }]);
  };

  const removeTeacher = (index: number) => {
    if (teachers.length > 1) {
      const newTeachers = [...teachers];
      newTeachers.splice(index, 1);
      setTeachers(newTeachers);
    }
  };

  const updateTeacher = (index: number, field: keyof Teacher, value: string) => {
    const newTeachers = [...teachers];
    newTeachers[index] = { ...newTeachers[index], [field]: value };
    setTeachers(newTeachers);
  };

  const handleAttendanceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttendanceFile(e.target.files[0]);
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
      venue: customVenue || centreNumbers[board],
      // 增加額外設置
      classroom,
      teachers,
      todayDate,
      attendanceFile
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
              Centre Number
            </label>
            <div className="flex gap-2 items-center">
              <div className="bg-gray-200 px-3 py-2 rounded-md text-gray-700">
                {board === 'Cambridge' ? 'CAIE:' : 'Edexcel:'}
              </div>
              <input
                type="text"
                id="venue"
                value={customVenue || centreNumbers[board]}
                onChange={(e) => setCustomVenue(e.target.value)}
                className="input flex-grow text-black font-medium"
                placeholder={centreNumbers[board]}
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
              Subject Component
              
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
            dateFormat="EEEE, MMMM d, yyyy"
            showWeekNumbers
            calendarClassName="bg-white shadow-lg rounded-md p-2"
            inline={false}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="start-time">
              Start Time (24-hour)
            </label>
            <input
              type="text"
              id="start-time"
              value={startTime}
              onChange={(e) => handleTimeChange(setStartTime, e.target.value)}
              placeholder="HH:MM (e.g. 09:00)"
              className="input w-full text-black font-medium"
              pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
              title="Please enter a valid 24-hour time format (HH:MM)"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="end-time">
              End Time (24-hour)
            </label>
            <input
              type="text"
              id="end-time"
              value={endTime}
              onChange={(e) => handleTimeChange(setEndTime, e.target.value)}
              placeholder="HH:MM (e.g. 11:00)"
              className="input w-full text-black font-medium"
              pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]"
              title="Please enter a valid 24-hour time format (HH:MM)"
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            className="flex items-center text-ulc-blue hover:text-blue-800 font-medium"
            onClick={() => setShowAdditionalSettings(!showAdditionalSettings)}
          >
            <svg 
              className={`w-5 h-5 mr-2 transition-transform ${showAdditionalSettings ? 'transform rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
            Additional Settings
          </button>
        </div>

        {showAdditionalSettings && (
          <div className="bg-gray-50 p-4 rounded-lg mt-2 border border-gray-200">
            <h3 className="text-lg font-medium mb-4 text-ulc-blue">Other details</h3>
            
            <div className="grid gap-4">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="today-date">
                  Date today
                </label>
                <DatePicker
                  id="today-date"
                  selected={todayDate}
                  onChange={(date: Date) => setTodayDate(date)}
                  className="input w-full text-black font-medium"
                  dateFormat="EEEE, MMMM d, yyyy"
                  calendarClassName="bg-white shadow-lg rounded-md p-2"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-gray-700">
                  Teacher-on-duty
                </label>
                
                {teachers.map((teacher, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={teacher.name}
                        onChange={(e) => updateTeacher(index, 'name', e.target.value)}
                        placeholder="Teacher name"
                        className="input w-full text-black font-medium"
                      />
                      <input
                        type="text"
                        value={teacher.time}
                        onChange={(e) => updateTeacher(index, 'time', e.target.value)}
                        placeholder="Time (e.g. 9:00-11:00)"
                        className="input w-full text-black font-medium"
                      />
                    </div>
                    
                    {teachers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTeacher(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                        aria-label="Remove teacher"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addTeacher}
                  className="flex items-center text-ulc-blue hover:text-blue-800 font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add more teacher
                </button>
              </div>

              <div>
                <label className="block text-gray-700 mb-2" htmlFor="classroom">
                  Classroom
                </label>
                <select
                  id="classroom"
                  value={classroom}
                  onChange={(e) => setClassroom(e.target.value)}
                  className="select w-full text-black font-medium"
                >
                  <option value="">Select a classroom</option>
                  {classrooms.map((room, index) => (
                    <option key={index} value={room}>{room}</option>
                  ))}
                  <option value="custom">Custom...</option>
                </select>
                {classroom === 'custom' && (
                  <input
                    type="text"
                    value=""
                    onChange={(e) => setClassroom(e.target.value)}
                    className="input w-full mt-2 text-black font-medium"
                    placeholder="Enter classroom (e.g. Room 101)"
                  />
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2" htmlFor="attendance">
                  Upload attendance
                </label>
                <input
                  type="file"
                  id="attendance"
                  onChange={handleAttendanceUpload}
                  className="w-full text-black"
                  accept="image/*,.pdf"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Teacher takes photo and uploads the attendance after the duty.
                </p>
              </div>
            </div>
          </div>
        )}
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
