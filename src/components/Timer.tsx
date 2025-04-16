import React, { useState, useEffect, useCallback } from 'react';
import { ExamInfo } from '@/types';

interface TimerProps {
  examInfo: ExamInfo;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Timer({ examInfo }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isWarning, setIsWarning] = useState(false);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExamEnded, setIsExamEnded] = useState(false);

  // 將24小時格式轉換為12小時格式
  const formatTimeTo12Hour = (time24: string): string => {
    const [hours24, minutes] = time24.split(':').map(Number);
    const period = hours24 >= 12 ? 'P.M.' : 'A.M.';
    const hours12 = hours24 % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

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
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      // Set warning when less than 5 minutes remain
      if (difference <= 5 * 60 * 1000) {
        setIsWarning(true);
      }
    }
    
    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  }, [examInfo.date, examInfo.startTime, examInfo.endTime]);

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

  return (
    <div className={`p-6 rounded-lg shadow-lg ${isWarning ? 'bg-red-100 animate-pulse-fast' : 'bg-white'}`}>
      <h2 className="text-2xl font-bold mb-4 text-center text-ulc-blue">{getTimerMessage()}</h2>
      
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
      
      {isWarning && !isExamEnded && (
        <div className="p-4 bg-red-500 text-white text-center rounded-md font-bold mb-4">
          Less than 5 minutes remaining!
        </div>
      )}
      
      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="font-bold text-lg mb-2 text-ulc-blue">Exam Details</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-gray-600">Exam Board:</div>
          <div className="text-black font-medium">{examInfo.board}</div>
          
          <div className="text-gray-600">Subject:</div>
          <div className="text-black font-medium">{examInfo.subject.name}</div>
          
          <div className="text-gray-600">Subject Code:</div>
          <div className="text-black font-medium">{examInfo.subject.code}</div>
          
          <div className="text-gray-600">Venue:</div>
          <div className="text-black font-medium">{examInfo.venue}</div>
          
          <div className="text-gray-600">Date:</div>
          <div className="text-black font-medium">{examInfo.date.toLocaleDateString()}</div>
          
          <div className="text-gray-600">Time:</div>
          <div className="text-black font-medium">
            {formatTimeTo12Hour(examInfo.startTime)} - {formatTimeTo12Hour(examInfo.endTime)}
          </div>
        </div>
      </div>
    </div>
  );
} 