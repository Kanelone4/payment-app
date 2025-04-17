import React, { useState, useEffect } from 'react';
import Layout from '../Layout';
import { fetchNotifications, deleteNotification } from '../../services/authService';
import { FaBell, FaRegBell, FaCheck, FaTrash } from 'react-icons/fa';
import './notification.css';
import { useTranslation } from 'react-i18next';

interface Notification {
  _id: string;
  userId: string;
  event: string;
  data: {
    message: string;
    plan_id?: string;
    start_date?: string;
    end_date?: string;
    amount?: number;
    transaction_id?: number;
    timestamp: string;
  };
  timestamp: string;
  __v: number;
  read?: boolean;
}

const NotificationPage: React.FC = () => {
  const { t } = useTranslation('notifications');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'unread' | 'all'>('unread');
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setIsLoading(true);
        const data = await fetchNotifications();
        const notificationsWithReadStatus = data.map(notification => ({
          ...notification,
          read: false
        }));
        setNotifications(notificationsWithReadStatus);
        setUnreadCount(notificationsWithReadStatus.length);
      } catch (error) {
        console.error(t('error.loading'), error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, [t]);

  const handleNotificationClick = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification._id === id ? { ...notification, read: true } : notification
    ));
    setUnreadCount(prev => notifications.some(n => n._id === id && !n.read) ? prev - 1 : prev);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
    setUnreadCount(0);
  };

  const deleteNotificationHandler = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteNotification(id);
      const wasUnread = notifications.find(n => n._id === id)?.read === false;
      setNotifications(notifications.filter(notification => notification._id !== id));
      
      if (wasUnread) {
        setUnreadCount(prev => prev - 1);
      }
    } catch (error) {
      console.error(t('error.deleting'), error);
    }
  };

  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(notification => !notification.read)
    : notifications;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(t('locale'), {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationIcon = (event: string) => {
    switch (event) {
      case 'payment_success':
        return <span className="notification-icon payment">$</span>;
      case 'subscription_activated':
        return <span className="notification-icon subscription">✓</span>;
      default:
        return <span className="notification-icon default">!</span>;
    }
  };

  return (
    <Layout>
      <div className="notification-container">
        <div className="notification-header">
          <div className="notification-title-wrapper">
            <h2 className="notification-title">
              <FaBell className="mr-2" />
              {t('title')}
              {unreadCount > 0 && (
                <span className="global-unread-count">{unreadCount}</span>
              )}
            </h2>
          </div>
          
          <div className="notification-controls">
            <div className="notification-tabs">
              <button
                className={`tab-btn ${activeTab === 'unread' ? 'active' : ''}`}
                onClick={() => setActiveTab('unread')}
              >
                {t('tabs.unread')}
              </button>
              <button
                className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                {t('tabs.all')}
              </button>
            </div>
            
            <button 
              className="mark-all-read-btn"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <FaCheck /> {t('markAllRead')}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>{t('loading')}</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <FaRegBell size={48} className="empty-icon" />
            <h3>{t('tabs.title')}</h3>
            <p>{t('tabs.message')}</p>
          </div>
        ) : (
          <ul className="notification-list">
            {filteredNotifications.map(notification => (
              <li 
                key={notification._id} 
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => handleNotificationClick(notification._id)}
              >
                <div className="notification-content">
                  {getNotificationIcon(notification.event)}
                  <div className="notification-details">
                    <p className="notification-message">{notification.data.message}</p>
                    <div className="notification-meta">
                      <span className="notification-date">
                        {formatDate(notification.timestamp)}
                      </span>
                      {notification.event === 'payment_success' && notification.data.amount && (
                        <span className="notification-amount">
                          {notification.data.amount} $
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="notification-actions">
                  <button 
                    style={{color: 'black'}}
                    className="action-btn delete"
                    onClick={(e) => deleteNotificationHandler(notification._id, e)}
                    title={t('delete')}
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default NotificationPage;