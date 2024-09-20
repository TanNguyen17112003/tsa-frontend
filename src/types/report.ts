export interface ProofImage {
  url: string;
  altText: string;
}

type ReportStatus = 'PENDING' | 'SOLVED' | 'DECLINED';

export interface Report {
  id: string;
  orderId?: string;
  orderCode?: string;
  reportAt?: string;
  content: string;
  proof: ProofImage | string;
  reply?: string;
  repliedAt?: string;
  status: ReportStatus;
  replierId?: string;
  studentId?: string;
}

export interface ReportDetail extends Report {}

export interface ReportFormProps extends Partial<Report> {}

export const initialReportList: ReportDetail[] = [
  {
    id: '1',
    orderCode: '123',
    reportAt: '2021-08-01',
    content: 'Đơn hàng không đúng',
    proof: 'https://via.placeholder.com/150',
    reply: 'Chúng tôi sẽ xem xét và giải quyết sớm nhất',
    status: 'SOLVED'
  },
  {
    id: '1',
    orderCode: '123',
    reportAt: '2021-08-01',
    content: 'Đơn hàng không đúng',
    proof: 'https://via.placeholder.com/150',
    reply: 'Chúng tôi sẽ xem xét và giải quyết sớm nhất',
    status: 'SOLVED'
  },
  {
    id: '1',
    orderCode: '123',
    reportAt: '2021-08-01',
    content: 'Đơn hàng không đúng',
    proof: 'https://via.placeholder.com/150',
    reply: 'Chúng tôi sẽ xem xét và giải quyết sớm nhất',
    status: 'PENDING'
  },
  {
    id: '1',
    orderCode: '123',
    reportAt: '2021-08-01',
    content: 'Đơn hàng không đúng',
    proof: 'https://via.placeholder.com/150',
    reply: 'Chúng tôi sẽ xem xét và giải quyết sớm nhất',
    status: 'PENDING'
  },
  {
    id: '1',
    orderCode: '123',
    reportAt: '2021-08-01',
    content: 'Đơn hàng không đúng',
    proof: 'https://via.placeholder.com/150',
    reply: 'Chúng tôi sẽ xem xét và giải quyết sớm nhất',
    status: 'DECLINED'
  },
  {
    id: '1',
    orderCode: '123',
    reportAt: '2021-08-01',
    content: 'Đơn hàng không đúng',
    proof: 'https://via.placeholder.com/150',
    reply: 'Chúng tôi sẽ xem xét và giải quyết sớm nhất',
    status: 'DECLINED'
  }
];

export const initialReportForm: ReportFormProps = {
  reply: '',
  proof: ''
};

export const statusMap = {
  PENDING: 'Đang chờ xử lý',
  SOLVED: 'Đã giải quyết',
  DECLINED: 'Đã từ chối'
};
