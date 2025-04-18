import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ExamInfo, Teacher } from '@/types';
import DatePicker from 'react-datepicker';
import TimePicker from 'react-time-picker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

interface TimerProps {
  examInfo: ExamInfo;
  onEdit: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface ReportEvent {
  time: string;
  description: string;
  studentName?: string;
}

export default function Timer({ examInfo, onEdit }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isWarning, setIsWarning] = useState(false);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExamEnded, setIsExamEnded] = useState(false);
  const [events, setEvents] = useState<ReportEvent[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportDescription, setReportDescription] = useState('');
  const [showEvents, setShowEvents] = useState(false);
  const [reportStudentName, setReportStudentName] = useState(examInfo.studentName || '');
  
  // 用於播放音頻的參考
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // 追蹤是否已經播放了警告聲音
  const warningPlayedRef = useRef(false);

  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const examDate = new Date(examInfo.date);
    
    // Parse the exam start time
    const [startHours, startMinutes] = examInfo.startTime.split(':').map(Number);
    examDate.setHours(startHours, startMinutes, 0, 0);
    
    // Calculate time until exam starts
    let difference = examDate.getTime() - now.getTime();
    
    // If the exam has started, calculate time until it ends
    if (difference <= 0) {
      setIsExamStarted(true);
      
      // Parse the exam end time
      const [endHours, endMinutes] = examInfo.endTime.split(':').map(Number);
      const examEndDate = new Date(examInfo.date);
      examEndDate.setHours(endHours, endMinutes, 0, 0);
      
      difference = examEndDate.getTime() - now.getTime();
      
      // If the exam has ended
      if (difference <= 0) {
        setIsExamEnded(true);
        
        // 如果考試剛剛結束，播放提示音
        if (!warningPlayedRef.current && audioRef.current) {
          audioRef.current.play().catch(err => console.error("Error playing audio:", err));
          warningPlayedRef.current = true;
        }
        
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      // Set warning when less than 5 minutes remain
      if (difference <= 5 * 60 * 1000) {
        setIsWarning(true);
        
        // 播放提示音（僅一次）
        if (!warningPlayedRef.current && audioRef.current) {
          audioRef.current.play().catch(err => console.error("Error playing audio:", err));
          warningPlayedRef.current = true;
          
          // 自動添加五分鐘警告事件
          const now = new Date();
          const timeString = now.toLocaleTimeString('en-GB');
          const warningEvent: ReportEvent = {
            time: timeString,
            description: "系統警告：考試剩餘時間不足 5 分鐘！"
          };
          setEvents(prev => [...prev, warningEvent]);
        }
      }
    }
    
    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  }, [examInfo.date, examInfo.startTime, examInfo.endTime, setEvents]);

  useEffect(() => {
    // Update time immediately
    setTimeLeft(calculateTimeLeft());
    
    // Set up interval to update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    // Clear interval on component unmount
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);
  
  // 重置警告聲音標記當考試信息發生變化時
  useEffect(() => {
    warningPlayedRef.current = false;
  }, [examInfo]);

  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`;
  };

  const getTimerMessage = (): string => {
    if (isExamEnded) {
      return "Exam has ended";
    }
    
    if (isExamStarted) {
      return "Time remaining";
    }
    
    return "Time until exam starts";
  };
  
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return date.toLocaleDateString('en-GB', options);
  };
  
  const addEvent = () => {
    if (reportDescription.trim() === '') return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-GB');
    
    const newEvent: ReportEvent = {
      time: timeString,
      description: reportDescription.trim(),
      studentName: reportStudentName.trim() || examInfo.studentName || ''
    };
    
    setEvents([...events, newEvent]);
    setReportDescription('');
    setShowReportModal(false);
  };

  return (
    <div className={`p-6 rounded-lg shadow-lg ${isWarning ? 'bg-red-100 animate-pulse-fast' : 'bg-white'}`}>
      {/* 柔和提示音 */}
      <audio ref={audioRef} preload="auto">
        <source src="/notification.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-2xl font-bold ${isExamEnded ? 'text-red-600 text-4xl animate-bounce' : 'text-ulc-blue'}`}>{getTimerMessage()}</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowReportModal(true)}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Report
          </button>
          <button 
            onClick={onEdit}
            className="px-3 py-1 bg-ulc-blue text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>
        </div>
      </div>
      
      {isExamEnded ? (
        <div className="p-8 bg-red-50 rounded-lg border-2 border-red-500 text-center mb-6 animate-pulse">
          <span className="text-4xl font-bold text-red-600">The exam has ended.</span>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 text-center mb-6">
          <div className="flex flex-col">
            <div className="text-4xl font-bold text-ulc-blue">{formatNumber(timeLeft.days)}</div>
            <div className="text-gray-600">Days</div>
          </div>
          <div className="flex flex-col">
            <div className="text-4xl font-bold text-ulc-blue">{formatNumber(timeLeft.hours)}</div>
            <div className="text-gray-600">Hours</div>
          </div>
          <div className="flex flex-col">
            <div className="text-4xl font-bold text-ulc-blue">{formatNumber(timeLeft.minutes)}</div>
            <div className="text-gray-600">Minutes</div>
          </div>
          <div className="flex flex-col">
            <div className="text-4xl font-bold text-ulc-blue">{formatNumber(timeLeft.seconds)}</div>
            <div className="text-gray-600">Seconds</div>
          </div>
        </div>
      )}
      
      {isWarning && !isExamEnded && (
        <div className="p-4 bg-red-500 text-white text-center rounded-md font-bold mb-4 animate-pulse">
          <span className="text-xl">The exam is under five minutes remaining.</span>
        </div>
      )}
      
      <div className="p-3 bg-blue-50 border border-blue-200 rounded mb-4">
        <div className="text-center font-medium">
          <div className="text-ulc-blue text-lg mb-1">{formatDate(examInfo.date)}</div>
          {examInfo.studentName && (
            <div className="text-gray-700">Student: {examInfo.studentName}</div>
          )}
        </div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-md mb-4">
        <h3 className="font-bold text-lg mb-2 text-ulc-blue">Exam Details</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-gray-600">Exam Board:</div>
          <div className="text-black font-medium">{examInfo.board}</div>
          
          <div className="text-gray-600">Subject:</div>
          <div className="text-black font-medium">{examInfo.subject.name}</div>
          
          <div className="text-gray-600">Subject Component:</div>
          <div className="text-black font-medium">{examInfo.subject.code}</div>
          
          <div className="text-gray-600">Centre Number:</div>
          <div className="text-black font-medium">{examInfo.venue}</div>
          
          <div className="text-gray-600">Time:</div>
          <div className="text-black font-medium">
            {examInfo.startTime} - {examInfo.endTime}
          </div>
        </div>
      </div>

      {/* Other Details section - 現在默認顯示 */}
      <div className="bg-gray-100 p-4 rounded-md mt-4">
        <h3 className="font-bold text-lg mb-2 text-ulc-blue">Other Details</h3>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="text-gray-600">Classroom:</div>
          <div className="text-black font-medium">{examInfo.classroom || "Not specified"}</div>
        </div>
        
        {examInfo.teachers && examInfo.teachers.length > 0 && (
          <div className="mb-3">
            <div className="text-gray-600 mb-2">Teachers on duty:</div>
            <div className="pl-4 space-y-1">
              {examInfo.teachers.map((teacher, index) => (
                <div key={index} className="grid grid-cols-2 gap-2">
                  <div className="text-black font-medium">{teacher.name || "Name not provided"}</div>
                  <div className="text-black">{teacher.time || "Time not specified"}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {examInfo.attendanceFile && (
          <div>
            <div className="text-gray-600 mb-2">Attendance:</div>
            <div className="text-black">
              Uploaded: {examInfo.attendanceFile.name}
            </div>
          </div>
        )}
      </div>
      
      {/* 事件記錄按鈕 */}
      {events.length > 0 && (
        <div className="mt-4">
          <button
            type="button"
            className="flex items-center text-ulc-blue hover:text-blue-800 font-medium"
            onClick={() => setShowEvents(!showEvents)}
          >
            <svg 
              className={`w-5 h-5 mr-2 transition-transform ${showEvents ? 'transform rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
            {showEvents ? 'Hide Events' : 'Show Recorded Events'}
          </button>
          
          {showEvents && (
            <div className="bg-gray-100 p-4 rounded-md mt-2">
              <h3 className="font-bold text-lg mb-2 text-ulc-blue">Event Log</h3>
              <div className="space-y-2">
                {events.map((event, index) => (
                  <div key={index} className="border-b pb-2">
                    <div className="text-gray-600">{event.time}</div>
                    {event.studentName && (
                      <div className="text-gray-800 font-medium">Student: {event.studentName}</div>
                    )}
                    <div className="text-black">{event.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h3 className="text-xl font-bold mb-4 text-black">Report an Event</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="student-name">
                Student Name
              </label>
              <input
                type="text"
                id="student-name"
                value={reportStudentName}
                onChange={(e) => setReportStudentName(e.target.value)}
                className="w-full p-2 border rounded text-black font-medium"
                placeholder="Enter student name"
              />
            </div>
            
            <textarea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              className="w-full h-32 p-2 border rounded mb-4 text-black"
              placeholder="Describe what happened..."
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={addEvent}
                className="px-4 py-2 bg-ulc-blue text-black rounded hover:bg-blue-700"
              >
                Save Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 