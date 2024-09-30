import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MessageQuestion } from 'iconsax-react';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'Hệ thống TSA hoạt động như thế nào?',
    answer:
      'Hệ thống cho phép người dùng đặt hàng trực tuyến và chọn địa chỉ giao hàng mà không cần gặp trực tiếp shipper, sau đó nhân viên sẽ giao hàng đến tận nơi.'
  },
  {
    question: 'Giá mỗi lần vận chuyển đơn hàng là bao nhiêu?',
    answer:
      'Giá bán tùy thuộc vào khoảng cách và khối lượng đơn hàng sẽ dao động từ 10.000 VND đến 20.000 VND.'
  },
  {
    question: 'Hệ thống có những ưu đãi đặc biệt không?',
    answer:
      'Tất nhiên, hệ thống sẽ thường xuyên có những ưu đãi, voucher đặc biệt cho những khách hàng thân thiết.'
  }
];

export const LandingFAQs = () => {
  return (
    <Box
      paddingX={6}
      paddingY={5}
      sx={{
        backgroundColor: '#f6fdf5',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <Stack
        direction={'row'}
        alignSelf={'center'}
        spacing={2}
        justifyContent='center'
        alignItems={'center'}
        paddingX={2}
        paddingY={1}
        color={'primary.main'}
        border={1}
        marginBottom={1}
        borderRadius={2}
        width={'20%'}
      >
        <MessageQuestion size={24} variant='Bold' />
        <Typography>Các câu hỏi thường gặp</Typography>
      </Stack>
      <Typography textAlign={'center'} variant='h1' marginBottom={5} color='black'>
        FAQs
      </Typography>
      <Stack spacing={2} alignItems={'center'}>
        {faqs.map((faq, index) => (
          <Accordion key={index} sx={{ paddingY: 2, width: '50%' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant='h6'>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='body2'>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Box>
  );
};
