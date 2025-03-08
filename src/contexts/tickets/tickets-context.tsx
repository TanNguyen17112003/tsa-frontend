import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { TicketsApi } from 'src/api/tickets';
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType
} from 'src/hooks/use-function';
import { Ticket, TicketDetail, TicketStatus } from 'src/types/ticket';

interface ContextValue {
  getTicketsApi: UseFunctionReturnType<void, TicketDetail[]>;
  createTicket: (request: Omit<TicketDetail, 'id'>, attachments?: File[]) => Promise<void>;
  replyTicket: (ticketId: string, reply: string, attachments?: File[]) => Promise<void>;
  updateStatusTicket: (ticketId: string, status: TicketStatus) => Promise<void>;
}

export const TicketsContext = createContext<ContextValue>({
  getTicketsApi: DEFAULT_FUNCTION_RETURN,
  createTicket: async () => {},
  replyTicket: async () => {},
  updateStatusTicket: async () => {}
});

const TicketsProvider = ({ children }: { children: ReactNode }) => {
  const getTicketsApi = useFunction(TicketsApi.getListTicket, {
    disableResetOnCall: true
  });

  const createTicket = useCallback(
    async (request: Omit<TicketDetail, 'id'>, attachments?: File[]) => {
      try {
        const ticket = await TicketsApi.createTicket(request, attachments);
        if (ticket) {
          getTicketsApi.setData([...(getTicketsApi.data || []), ticket]);
        }
      } catch (error) {
        throw error;
      }
    },
    [getTicketsApi]
  );

  const replyTicket = useCallback(async (ticketId: string, reply: string, attachments?: File[]) => {
    try {
      await TicketsApi.replyTicket(ticketId, reply, attachments);
    } catch (error) {
      throw error;
    }
  }, []);

  const updateStatusTicket = useCallback(
    async (ticketId: string, status: TicketStatus) => {
      try {
        const updatedTicket = await TicketsApi.updateStatusTicket(ticketId, status);
        if (updatedTicket) {
          getTicketsApi.setData(
            (getTicketsApi.data || []).map((ticket) =>
              ticket.id === ticketId ? updatedTicket : ticket
            )
          );
        }
      } catch (error) {
        throw error;
      }
    },
    [getTicketsApi]
  );

  return (
    <TicketsContext.Provider
      value={{
        getTicketsApi,
        createTicket,
        replyTicket,
        updateStatusTicket
      }}
    >
      {children}
    </TicketsContext.Provider>
  );
};

export const useTicketsContext = () => useContext(TicketsContext);

export default TicketsProvider;
