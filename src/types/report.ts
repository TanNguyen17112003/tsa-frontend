import { v4 as uuidv4 } from 'uuid';

export interface ProofImage {
  url: string;
  altText: string;
}

export type ReportStatus = 'PENDING' | 'REPLIED';

export interface Report {
  id: string;
  orderId?: string;
  orderCode?: string;
  reportedAt?: string;
  content: string;
  proof: ProofImage | string;
  reply?: string;
  repliedAt?: string;
  status: ReportStatus;
  replierId?: string;
  studentId?: string;
}

export interface ReportDetail extends Report {}

export interface ReportFormProps extends Partial<Omit<ReportDetail, 'id'>> {}

export const initialReportForm: ReportFormProps = {
  orderId: '',
  reportedAt: '',
  content: '',
  proof: '',
  reply: '',
  repliedAt: '',
  studentId: ''
};

export const replyInitialReportForm: ReportFormProps = {
  reply: ''
};

export const statusMap = {
  'Đang chờ xử lý': 'PENDING',
  'Đã giải quyết': 'REPLIED'
};

export const initialReportList: ReportDetail[] = [];

const getRandomContent = (): string => {
  const contents = [
    'Lorem ipsum dolor sit amet.',
    'Consectetur adipiscing elit.',
    'Sed do eiusmod tempor incididunt.',
    'Ut labore et dolore magna aliqua.',
    'Ut enim ad minim veniam.'
  ];
  return contents[Math.floor(Math.random() * contents.length)];
};

const getRandomImageUrl = (): string => {
  const images = [
    'https://via.placeholder.com/150',
    'https://via.placeholder.com/200',
    'https://via.placeholder.com/250',
    'https://via.placeholder.com/300',
    'https://via.placeholder.com/350'
  ];
  return images[Math.floor(Math.random() * images.length)];
};

const getRandomUUID = (): string => {
  return uuidv4();
};

const getRandomReportStatus = (): ReportStatus => {
  const statuses: ReportStatus[] = ['PENDING', 'REPLIED'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const generateReportsForMonth = (year: number, month: number) => {
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dayString = day.toString().padStart(2, '0');
    const date = new Date(`${year}-${month.toString().padStart(2, '0')}-${dayString}T00:00:00Z`);
    const unixTimestamp = Math.floor(date.getTime() / 1000);

    initialReportList.push({
      id: `${year}-${month}-${day}`,
      orderId: `${year}-${month}-${day}`,
      orderCode: `${year}-${month}-${day}`,
      reportedAt: unixTimestamp.toString(),
      content: getRandomContent(),
      proof: {
        url: getRandomImageUrl(),
        altText: getRandomContent()
      },
      reply: getRandomContent(),
      repliedAt: unixTimestamp.toString(),
      status: getRandomReportStatus(),
      replierId: getRandomUUID(),
      studentId: getRandomUUID()
    });
  }
};

// Example usage
for (let month = 1; month <= 12; month++) {
  generateReportsForMonth(2024, month);
}
