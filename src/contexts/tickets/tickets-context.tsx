import { createContext, ReactNode, useCallback, useContext, useEffect } from 'react';
import {
  TicketCategoryProps,
  TicketCategoryReplyProps,
  TicketFormProps,
  TicketsApi
} from 'src/api/tickets';
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType
} from 'src/hooks/use-function';
import { TicketDetail, TicketStatus } from 'src/types/ticket';

interface ContextValue {
  getTicketsApi: UseFunctionReturnType<void, TicketDetail[]>;
  getTicketCategoriesApi: UseFunctionReturnType<void, TicketCategoryReplyProps[]>;
  createTicketCategory: (request: TicketCategoryProps) => Promise<void>;
  createTicket: (request: TicketFormProps, attachments?: File[]) => Promise<void>;
  replyTicket: (ticketId: string, reply: string, attachments?: File[]) => Promise<void>;
  updateStatusTicket: (ticketId: string, status: TicketStatus) => Promise<void>;
}

export const TicketsContext = createContext<ContextValue>({
  getTicketsApi: DEFAULT_FUNCTION_RETURN,
  getTicketCategoriesApi: DEFAULT_FUNCTION_RETURN,
  createTicketCategory: async () => {},
  createTicket: async () => {},
  replyTicket: async () => {},
  updateStatusTicket: async () => {}
});

const TicketsProvider = ({ children }: { children: ReactNode }) => {
  const getTicketsApi = useFunction(TicketsApi.getListTicket, {
    disableResetOnCall: true
  });

  const getTicketCategoriesApi = useFunction(TicketsApi.getTicketCategories, {
    disableResetOnCall: true
  });

  const createTicketCategory = useCallback(
    async (request: TicketCategoryProps) => {
      try {
        const newCategory = await TicketsApi.creatTicketCategory(request);
        if (newCategory) {
          getTicketCategoriesApi.setData([...(getTicketCategoriesApi.data || []), newCategory]);
        }
      } catch (error) {
        throw error;
      }
    },
    [getTicketCategoriesApi]
  );

  const createTicket = useCallback(
    async (request: TicketFormProps, attachments?: File[]) => {
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

  const replyTicket = useCallback(
    async (ticketId: string, reply: string, attachments?: File[]) => {
      try {
        const newReply = await TicketsApi.replyTicket(ticketId, reply, attachments);
        if (newReply) {
          getTicketsApi.setData(
            (getTicketsApi.data || []).map((ticket) =>
              ticket.id === ticketId
                ? {
                    ...ticket,
                    replies: [...ticket.replies, newReply]
                  }
                : ticket
            )
          );
        }
      } catch (error) {
        throw error;
      }
    },
    [getTicketsApi]
  );

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

  useEffect(() => {
    getTicketsApi.call({});
    getTicketCategoriesApi.call({});
  }, []);

  return (
    <TicketsContext.Provider
      value={{
        getTicketsApi,
        getTicketCategoriesApi,
        createTicketCategory,
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
