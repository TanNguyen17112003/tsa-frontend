export interface ProofImage {
  url: string;
  altText: string;
}

type ReportStatus = 'PENDING' | 'REPLIED';

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

export const statusMap = {
  PENDING: 'Đang chờ xử lý',
  SOLVED: 'Đã giải quyết',
  DECLINED: 'Đã từ chối'
};
