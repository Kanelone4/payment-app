// src/components/Factures.tsx
"use client";

import React, { useState, useEffect, CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../Layout';
import { fetchInvoices, downloadInvoice } from '../../auth/core/_requests';
import { FaFileInvoiceDollar, FaSpinner, FaDownload } from 'react-icons/fa';
import { PiNewspaperClippingBold } from "react-icons/pi";

interface Invoice {
  invoiceNumber: string;
  amount: number;
  date: string;
  planName: string;
  productName: string;
  details: {
    invoiceId: string;
    user: {
      name: string;
      email: string;
      username: string;
    };
  };
}

const styles: Record<string, CSSProperties> = {
  container: {
    width: '100%',
    margin: 0,
    padding: '3rem 5rem',
  },
  header: {
    textAlign: 'left',
    marginBottom: '2rem',
  },
  headerTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1f2937',
    margin: 0,
  },
  headerSubtitle: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: '0.5rem 0 0',
  },
  invoiceGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  invoiceCard: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    padding: '2rem',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
  },
  headerInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '1rem',
  },
  invoiceNumber: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#111827',
  },
  invoiceDate: {
    fontSize: '0.875rem',
    color: '#6b7280',
  },
  detailsBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  planName: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#2563eb',
  },
  userName: {
    fontSize: '1rem',
    fontWeight: 500,
    color: '#374151',
  },
  productName: {
    fontSize: '1rem',
    fontWeight: 500,
    color: '#374151',
  },
  userEmail: {
    fontSize: '0.875rem',
    color: '#6b7280',
  },
  amount: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '1rem',
  },
  downloadBtn: {
    alignSelf: 'flex-end',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '16rem',
    marginTop:'160px',
    marginLeft:'50px'
  },
  spinner: {
    animation: 'spin 1s linear infinite',
    fontSize: '1.5rem',
    color: '#3b82f6',
    marginBottom: '1rem',
  },
  emptyState: {
    textAlign: 'center',
    color: '#6b7280',
    padding: '4rem 1rem',
  },
};

const Factures: React.FC = () => {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchInvoices();
        setInvoices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.loading_error'));
      } finally {
        setLoading(false);
      }
    })();
  }, [t]);

  const handleDownload = async (invoiceId: string, invoiceNumber: string) => {
    try {
      setLoading(true);
      const blob = await downloadInvoice(invoiceId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Facture_${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (err) {
      console.error('Erreur de téléchargement:', err);
      setError(
        err instanceof Error 
          ? err.message.includes('non trouvée')
            ? 'La facture demandée n\'existe pas sur le serveur'
            : err.message
          : 'Erreur lors du téléchargement'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const safeLocale = 'fr-FR';
    const date = new Date(dateString);
    
    try {
      return date.toLocaleDateString(safeLocale, {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      console.error('Erreur de formatage de date:', e);
      // Fallback au format ISO
      return date.toISOString().split('T')[0];
    }
  };

  const formatAmount = (amount: number) => {
   
    const safeLocale = 'fr-FR'; 
    
    try {
      return new Intl.NumberFormat(safeLocale, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount / 575.93);
    } catch (e) {
      console.error('Erreur de formatage monétaire:', e);
      return `${(amount / 575.93).toFixed(2)} USD`;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={styles.loadingContainer}>
          <FaSpinner style={styles.spinner} />
          <span>{t('invoices.loading')}</span>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div style={styles.emptyState}>
          <header style={{padding: '15rem', textAlign: 'center'}}>
            <p>{error}</p>
          </header>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>
            <PiNewspaperClippingBold style={{ marginRight: '0.5rem', color: '#3b82f6', fontSize: '30px' }} />
            {t('invoices.my_invoices')}
          </h1>
          <p style={styles.headerSubtitle}>{t('invoices.subtitle')}</p>
        </header>

        {invoices.length === 0 ? (
          <div style={styles.emptyState}>
            <FaFileInvoiceDollar style={{ fontSize: '2rem', marginBottom: '1rem', color: '#9ca3af' }} />
            <h3>{t('invoices.no_invoices')}</h3>
            <p>{t('invoices.no_invoices_message')}</p>
          </div>
        ) : (
          <div style={styles.invoiceGrid}>
            {invoices.map((inv) => (
              <div
                key={inv.invoiceNumber}
                className="invoice-card"
                style={styles.invoiceCard}>
                <div style={styles.headerInfo}>
                  <div style={styles.invoiceNumber}>{t('invoices.invoice')} #{inv.invoiceNumber}</div>
                  <div style={styles.invoiceDate}>{formatDate(inv.date)}</div>
                </div>
                <div style={styles.detailsBlock}>
                  <div style={styles.productName}>{inv.productName}</div>
                  <div style={styles.planName}>{inv.planName}</div>
                  <div style={styles.userName}>{inv.details.user.name}</div>
                  <div style={styles.userEmail}>{inv.details.user.email}</div>
                </div>
                <div style={styles.amount}>{formatAmount(inv.amount)}</div>
                <button
                  style={styles.downloadBtn}
                  onClick={() => {
                    console.log('Downloading invoice ID:', inv.details.invoiceId); 
                    handleDownload(inv.details.invoiceId, inv.invoiceNumber);
                  }}
                  disabled={loading}
                >
                  {loading ? <FaSpinner className="animate-spin" /> : <FaDownload />}
                  {loading ? t('invoices.downloading') : t('invoices.download')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        .invoice-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.15);
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Layout>
  );
};

export default Factures;