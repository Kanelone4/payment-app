import React, { useState, useEffect } from 'react';
import Layout from '../Layout';
import { fetchNotifications } from '../../services/authService';
import { FaBell, FaRegBell, FaCheck, FaTrash } from 'react-icons/fa';
import './notification.css'

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'unread' | 'all'>('unread');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setIsLoading(true);
        const data = await fetchNotifications();
        // Ajoutez un champ 'read' pour gérer l'état de lecture
        const notificationsWithReadStatus = data.map(notification => ({
          ...notification,
          read: false // Par défaut, toutes les notifications sont non lues
        }));
        setNotifications(notificationsWithReadStatus);
      } catch (error) {
        console.error('Failed to load notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification._id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification._id !== id));
  };

  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(notification => !notification.read)
    : notifications;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
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
        return <span className="notification-icon payment">€</span>;
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
          <h2 className="notification-title">
            <FaBell className="mr-2" />
            Notifications
          </h2>
          
          <div className="notification-tabs">
            <button
              className={`tab-btn ${activeTab === 'unread' ? 'active' : ''}`}
              onClick={() => setActiveTab('unread')}
            >
              Non lues
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="unread-count">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            <button
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Toutes
            </button>
          </div>
          
          <button 
            className="mark-all-read-btn"
            onClick={markAllAsRead}
            disabled={notifications.filter(n => !n.read).length === 0}
          >
            <FaCheck /> Tout marquer comme lu
          </button>
        </div>

        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Chargement des notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <FaRegBell size={48} className="empty-icon" />
            <h3>Aucune notification {activeTab === 'unread' ? 'non lue' : ''}</h3>
            <p>{activeTab === 'unread' 
              ? 'Vous avez lu toutes vos notifications' 
              : 'Vous n\'avez aucune notification'}
            </p>
          </div>
        ) : (
          <ul className="notification-list">
            {filteredNotifications.map(notification => (
              <li 
                key={notification._id} 
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
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
                          {notification.data.amount} €
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="notification-actions">
                  {!notification.read && (
                    <button 
                      className="action-btn mark-read"
                      onClick={() => markAsRead(notification._id)}
                      title="Marquer comme lu"
                    >
                      <FaCheck />
                    </button>
                  )}
                  <button 
                    className="action-btn delete"
                    onClick={() => deleteNotification(notification._id)}
                    title="Supprimer"
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