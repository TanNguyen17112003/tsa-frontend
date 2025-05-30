import React, { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import TicketDetail from './ticket-detail';
import { Box } from '@mui/material';
import getTicketTableConfigs from './ticket-table-config';
import TicketFilter from './ticket-filter';
import { CustomTable } from '@components';
import { TicketDetail as Detail } from 'src/types/ticket';
import { useTicketsContext } from 'src/contexts/tickets/tickets-context';
import usePagination from 'src/hooks/use-pagination';

function TicketManagement() {
  const [selectedStatus, setSelectedStatus] = useState<string>('Tất cả');
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null
  });
  const [searchInput, setSearchInput] = useState('');
  const { getTicketsApi } = useTicketsContext();

  const router = useRouter();
  const ticketTableConfig = getTicketTableConfigs({});
  const handleGoTicket = useCallback(
    (ticket: Detail) => {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, ticketId: ticket.id }
      });
    },
    [router]
  );

  const results = useMemo(() => {
    return (getTicketsApi.data || []).filter((ticket) => {
      const filteredStatus = selectedStatus === 'Tất cả' ? true : ticket.status === selectedStatus;
      const filteredDate =
        dateRange.startDate && dateRange.endDate
          ? new Date(ticket.createdAt) >= dateRange.startDate &&
            new Date(ticket.createdAt) <= dateRange.endDate
          : true;
      const filteredSearch = searchInput
        ? ticket.title.toLowerCase().includes(searchInput.toLowerCase())
        : true;
      return filteredStatus && filteredDate && filteredSearch;
    });
  }, [getTicketsApi.data, selectedStatus, dateRange, searchInput]);

  const ticketPagination = usePagination({
    count: results.length
  });

  return router.query.ticketId ? (
    <TicketDetail />
  ) : (
    <Box display={'flex'} flexDirection={'column'} gap={3}>
      <TicketFilter
        numberOfTickets={results.length}
        statusList={['Tất cả', 'Đang mở', 'Đang trao đổi', 'Đã trả lời', 'Đã hoàn thành']}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        dateRange={dateRange}
        setDateRange={setDateRange}
        onSearch={setSearchInput}
      />
      <CustomTable
        rows={results}
        configs={ticketTableConfig}
        onClickRow={(data) => handleGoTicket(data)}
        pagination={ticketPagination}
      />
    </Box>
  );
}

export default TicketManagement;
