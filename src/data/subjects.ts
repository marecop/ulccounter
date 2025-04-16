import { Subject, SubjectsByBoard } from '../types';

export const venues = {
  Cambridge: 'CN399',
  Edexcel: '91829'
};

export const subjects: SubjectsByBoard = {
  Cambridge: [
    { name: 'Accounting', code: '0452' },
    { name: 'Art & Design', code: '0400' },
    { name: 'Biology', code: '0610' },
    { name: 'Business Studies', code: '0450' },
    { name: 'Chemistry', code: '0620' },
    { name: 'Computer Science', code: '0478' },
    { name: 'Economics', code: '0455' },
    { name: 'English - First Language', code: '0500' },
    { name: 'English Literature', code: '0475' },
    { name: 'Geography', code: '0460' },
    { name: 'Global Perspectives', code: '0457' },
    { name: 'History', code: '0470' },
    { name: 'Information & Communication Technology', code: '0417' },
    { name: 'Mathematics', code: '0580' },
    { name: 'Physics', code: '0625' },
    { name: 'Chinese - First Language', code: '0509' },
    { name: 'Chinese - Second Language', code: '0523' },
    { name: 'Chinese - Foreign Language', code: '0547' },
    { name: 'English - Second Language', code: '0510' }
  ],
  Edexcel: [
    { name: 'Accounting', code: '4AC1' },
    { name: 'Biology', code: '4BI1' },
    { name: 'Business Studies', code: '4BS1' },
    { name: 'Chemistry', code: '4CH1' },
    { name: 'Computer Science', code: '4CP0' },
    { name: 'Economics', code: '4EC1' },
    { name: 'English - First Language', code: '4EA1' },
    { name: 'English Literature', code: '4ET1' },
    { name: 'Geography', code: '4GE1' },
    { name: 'History', code: '4HI1' },
    { name: 'Mathematics A', code: '4MA1' },
    { name: 'Mathematics B', code: '4MB1' },
    { name: 'Physics', code: '4PH1' },
    { name: 'French', code: '4FR1' },
    { name: 'German', code: '4GN1' },
    { name: 'Spanish', code: '4SP1' },
    { name: 'Further Pure Mathematics', code: '4PM1' },
    { name: 'Pure Mathematics 1', code: 'WMA11' },
    { name: 'Pure Mathematics 2', code: 'WMA12' },
    { name: 'Pure Mathematics 3', code: 'WMA13' },
    { name: 'Pure Mathematics 4', code: 'WMA14' },
    { name: 'Statistics 1', code: 'WST01' },
    { name: 'Statistics 2', code: 'WST02' },
    { name: 'Mechanics 1', code: 'WME01' },
    { name: 'Mechanics 2', code: 'WME02' },
    { name: 'Decision Mathematics 1', code: 'WDM01' },
    { name: 'Further Pure Mathematics 1', code: 'WFM01' },
    { name: 'Further Pure Mathematics 2', code: 'WFM02' },
    { name: 'Further Pure Mathematics 3', code: 'WFM03' }
  ]
}; 