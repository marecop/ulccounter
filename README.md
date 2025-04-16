# Exam Countdown Timer

A web application for keeping track of exam times with detailed information about venue, subject, and timings. The app provides a countdown timer and alerts when there are 5 minutes remaining in the exam.

## Features

- Select from Cambridge or Edexcel examination boards
- Choose from a comprehensive list of subjects
- Set exam date and time
- Displays venue code information
- Countdown timer showing days, hours, minutes, and seconds
- Warning alert when 5 minutes remain in the exam
- Responsive design for all devices

## Tech Stack

- Next.js
- React
- TypeScript
- TailwindCSS
- date-fns for date handling
- react-datepicker for date selection

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Use

1. Select your exam board (Cambridge or Edexcel)
2. Choose the subject from the dropdown
3. Set the exam date
4. Enter start and end times
5. Customize the venue code if needed
6. Click "Start Timer" to begin the countdown

The timer will automatically switch from counting down to the exam start time to counting down the remaining exam time once the exam begins.

## License

MIT 

## 通知音效

本應用需要一個通知音效文件，用於在考試最後五分鐘提醒用戶。

請將名為 `notification.mp3` 的音效文件放入 `public` 目錄中。您可以從以下網站獲取免費通知音效：

1. [Pixabay](https://pixabay.com/sound-effects/search/notification/)
2. [Freesound](https://freesound.org/search/?q=notification)
3. [Zapsplat](https://www.zapsplat.com/sound-effect-category/notifications-alerts-and-prompts/)

音效文件需保存為 MP3 格式，並命名為 `notification.mp3`。 