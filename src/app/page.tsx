'use client';

import React, { useState } from 'react';
import ExamForm from '@/components/ExamForm';
import Timer from '@/components/Timer';
import { ExamInfo } from '@/types';
import Image from 'next/image';

export default function Home() {
  const [examInfo, setExamInfo] = useState<ExamInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleExamSubmit = (info: ExamInfo) => {
    setExamInfo(info);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <Image 
            src="/guis-ulc-logo.png" 
            alt="GUIS ULC Logo" 
            width={400} 
            height={100} 
            priority
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">ULC Exam Countdown Timer</h1>
        <p className="text-white">Set up your exam details and keep track of time</p>
      </header>

      {examInfo && !isEditing ? (
        <div className="mb-6">
          <Timer examInfo={examInfo} onEdit={handleEdit} />
          <div className="mt-6 text-center">
            <button
              onClick={() => setExamInfo(null)}
              className="btn bg-ulc-blue text-white hover:bg-blue-700 px-6 py-2 rounded-md shadow-md"
            >
              Set Up New Exam
            </button>
          </div>
        </div>
      ) : (
        <ExamForm 
          onSubmit={handleExamSubmit} 
          initialData={isEditing ? examInfo : undefined}
        />
      )}
      
      <footer className="mt-12 text-center text-white text-sm">
        <p>Copyright © 2025 Huang Zhangjun</p>
        <p className="mt-1">If anything went wrong, contact zhahuang2868@ulinkcollege.com</p>
      </footer>
    </div>
  );
} 