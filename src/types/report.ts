interface ProofImage {
  url: string;
  altText: string;
}

type ReportStatus = 'PENDING' | 'SOLVED' | 'DECLINED';

export interface Report {
  id: string;
  orderCode?: string;
  reportDate: string;
  reportContent: string;
  proof: ProofImage | string;
  reply?: string;
  reportStatus: ReportStatus;
}

export interface ReportDetail extends Report {}

export const initialReportList: ReportDetail[] = [
  {
    id: '1',
    orderCode: '123',
    reportDate: '2021-08-01',
    reportContent: 'Đơn hàng không đúng',
    proof: 'https://via.placeholder.com/150',
    reply: 'Chúng tôi sẽ xem xét và giải quyết sớm nhất',
    reportStatus: 'SOLVED'
  },
  {
    id: '1',
    orderCode: '123',
    reportDate: '2021-08-01',
    reportContent: 'Đơn hàng không đúng',
    proof: 'https://via.placeholder.com/150',
    reply: 'Chúng tôi sẽ xem xét và giải quyết sớm nhất',
    reportStatus: 'SOLVED'
  },
  {
    id: '1',
    orderCode: '123',
    reportDate: '2021-08-01',
    reportContent: 'Đơn hàng không đúng',
    proof: 'https://via.placeholder.com/150',
    reply: 'Chúng tôi sẽ xem xét và giải quyết sớm nhất',
    reportStatus: 'PENDING'
  },
  {
    id: '1',
    orderCode: '123',
    reportDate: '2021-08-01',
    reportContent: 'Đơn hàng không đúng',
    proof: 'https://via.placeholder.com/150',
    reply: 'Chúng tôi sẽ xem xét và giải quyết sớm nhất',
    reportStatus: 'PENDING'
  },
  {
    id: '1',
    orderCode: '123',
    reportDate: '2021-08-01',
    reportContent: 'Đơn hàng không đúng',
    proof: 'https://via.placeholder.com/150',
    reply: 'Chúng tôi sẽ xem xét và giải quyết sớm nhất',
    reportStatus: 'DECLINED'
  },
  {
    id: '1',
    orderCode: '123',
    reportDate: '2021-08-01',
    reportContent: 'Đơn hàng không đúng',
    proof: 'https://via.placeholder.com/150',
    reply: 'Chúng tôi sẽ xem xét và giải quyết sớm nhất',
    reportStatus: 'DECLINED'
  }
];

export const reportStatusMap = {
  PENDING: 'Đang chờ xử lý',
  SOLVED: 'Đã giải quyết',
  DECLINED: 'Đã từ chối'
};
