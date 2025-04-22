"use client";

import React, { useState, useEffect } from "react";
import Layout from "../Layout";
import { FaDownload, FaSpinner } from "react-icons/fa";
import { PiNewspaperClippingBold } from "react-icons/pi";
import { fetchInvoices, downloadInvoice } from "../../auth/core/_requests";
import { useTranslation } from 'react-i18next';

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

const Factures: React.FC = () => {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        setIsLoading(true);
        const data = await fetchInvoices();
        setInvoices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('common.loading_error'));
        console.error("Error loading invoices:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadInvoices();
  }, [t]);

  const handleDownload = async (invoiceId: string, invoiceNumber: string) => {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
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

  if (error) {
    return (
      <Layout>
        <div className="container-fluid px-4 mt-5 text-center align-items-center">
          <h4>{t('invoices.title')}</h4>
          <p>Vous n'avez pas de facture</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            {t('invoices.retry')}
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-fluid px-4">
        <div className="d-flex flex-column py-4 mb-3">
          <h2 className="m-0 fw-bold">
            <PiNewspaperClippingBold className="me-2" style={{ color: '#3b82f6' }} />
            {t('invoices.my_invoices')}
          </h2>
          <p className="text-muted mt-2">
            {t('invoices.subtitle')}
          </p>
        </div>

        <div className="card border-0 shadow-sm mb-4">
          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
              <div className="text-center">
                <FaSpinner className="spinner-border text-primary" style={{ width: "2.5rem", height: "2.5rem" }} />
                <p className="mt-3">{t('invoices.loading')}</p>
              </div>
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-5">
              <PiNewspaperClippingBold className="text-muted" style={{ fontSize: "3rem" }} />
              <h3 className="mt-3">{t('invoices.no_invoices')}</h3>
              <p className="text-muted">Vous n'avez aucune facture pour le moment.</p>
            </div>
          ) : (
            <div className="card-body p-4">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th className="border-0">{t('invoices.number')}</th>
                      <th className="border-0">{t('invoices.date')}</th>
                      <th className="border-0">{t('invoices.product')}</th>
                      <th className="border-0">{t('invoices.plan')}</th>
                      <th className="border-0">{t('invoices.client')}</th>
                      <th className="border-0">{t('invoices.amount')}</th>
                      <th className="border-0 text-end">{t('invoices.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.invoiceNumber}>
                        <td>#{invoice.invoiceNumber}</td>
                        <td>{formatDate(invoice.date)}</td>
                        <td>{invoice.productName}</td>
                        <td>{invoice.planName}</td>
                        <td>
                          <div>{invoice.details.user.name}</div>
                          <div className="text-muted small">{invoice.details.user.email}</div>
                        </td>
                        <td>{formatAmount(invoice.amount)}</td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-primary d-flex align-items-center gap-1 ms-auto"
                            onClick={() => handleDownload(invoice.details.invoiceId, invoice.invoiceNumber)}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <FaSpinner className="spinner-border" />
                            ) : (
                              <FaDownload />
                            )}
                            {t('invoices.download')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Factures;