import { createContext, ReactNode, useCallback, useEffect, useContext } from 'react';
import { NotificationsApi } from 'src/api/notifications';
import useFunction, {
  DEFAULT_FUNCTION_RETURN,
  UseFunctionReturnType
} from 'src/hooks/use-function';
import { NotificationFormProps } from 'src/api/notifications';
import { Notification, NotificationDetail } from 'src/types/notification';
import { dateToUnixTimestamp } from 'src/utils/format-time-currency';

interface ContextValue {
  getNotificationsApi: UseFunctionReturnType<FormData, NotificationDetail[]>;
  sendNotification: (request: Omit<Notification, 'id'>) => Promise<void>;
  updateNotificationStatus: (id: Notification['id']) => Promise<void>;
}

export const NotificationsContext = createContext<ContextValue>({
  getNotificationsApi: DEFAULT_FUNCTION_RETURN,
  sendNotification: async () => {},
  updateNotificationStatus: async () => {}
});

const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const getNotificationsApi = useFunction(NotificationsApi.getNotifications);

  const sendNotification = useCallback(
    async (request: Omit<NotificationDetail, 'id'>) => {
      try {
        const newNotification = await NotificationsApi.sendNotification(request);
        if (newNotification) {
          const newNotifications: NotificationDetail[] = [
            {
              ...request,
              id: newNotification.id
            },
            ...(getNotificationsApi.data || [])
          ];
          getNotificationsApi.setData(newNotifications);
        }
      } catch (error) {
        throw error;
      }
    },
    [getNotificationsApi]
  );

  const updateNotificationStatus = useCallback(
    async (id: Notification['id']) => {
      await NotificationsApi.updateNotificationStatus(id);
      getNotificationsApi.setData(
        (getNotificationsApi.data || []).map((c) =>
          c.id == id ? Object.assign(c, { isRead: true }) : c
        )
      );
    },
    [getNotificationsApi]
  );

  useEffect(() => {
    getNotificationsApi.call(new FormData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        getNotificationsApi,
        sendNotification,
        updateNotificationStatus
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationsContext = () => useContext(NotificationsContext);

export default NotificationsProvider;
