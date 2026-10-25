import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, Download, AlertCircle, ShieldCheck, QrCode } from 'lucide-react';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  amount: number;
  bookingCode?: string;
  bookingId?: number;
  destinationUrl?: string;
  onPaymentSubmitted?: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({
  isOpen,
  onClose,
  title,
  amount,
  bookingCode = 'PP-BK-DIRECT',
  bookingId,
  destinationUrl,
  onPaymentSubmitted
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upiId = 'parametricplay@upi';
  const payeeName = 'Parametric Play';
  
  // Format standard UPI deep-link URL
  const upiUrl = destinationUrl || `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Booking ${bookingCode}`)}`;

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(upiUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#072013',
          light: '#FFFFFF'
        }
      })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR generation error:', err));
    }
  }, [isOpen, upiUrl]);

  if (!isOpen) return null;

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `ParametricPlay_Payment_${bookingCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmitUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      setError('Please enter your 12-digit UPI Reference / UTR Number');
      return;
    }
    if (utrNumber.trim().length < 8) {
      setError('Valid UTR / Transaction number is typically 12 digits');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (bookingId) {
        const res = await fetch(`/api/bookings/${bookingId}/submit-payment`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            utrTransactionRef: utrNumber.trim(),
            paymentMethod: 'UPI QR'
          })
        });
        const data = await res.json();
        if (data.success) {
          setSubmittedMessage('Payment reference submitted successfully! Your booking status is now "Payment Pending Verification". Our accounts team will confirm within 2 hours.');
          if (onPaymentSubmitted) onPaymentSubmitted();
        } else {
          setError(data.error || 'Failed to submit payment reference');
        }
      } else {
        setSubmittedMessage('UTR recorded for verification. Status: Payment Pending Verification.');
      }
    } catch (err: any) {
      setError('Network error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm no-print">
      <div className="bg-forest-900 border border-forest-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-forest-950 p-4 border-b border-forest-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-lime-400" />
            <h3 className="font-heading font-bold text-white text-base">UPI Payment & Verification</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-forest-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="text-center">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">{title}</span>
            <div className="text-3xl font-heading font-extrabold text-lime-400 mt-1">
              ₹{amount.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Booking Ref: <strong className="text-slate-200">{bookingCode}</strong></p>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-inner border-2 border-forest-700 max-w-[260px] mx-auto">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Parametric Play Payment QR" className="w-56 h-56 object-contain" />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-forest-950 text-xs">
                Generating payment QR...
              </div>
            )}
            <span className="text-[10px] text-slate-600 font-bold uppercase mt-1">
              Scan with GPay, PhonePe, Paytm, or BHIM
            </span>
          </div>

          {/* Download & Copy controls */}
          <div className="flex items-center justify-between gap-2 bg-forest-950 p-3 rounded-xl border border-forest-800">
            <div>
              <p className="text-[11px] text-slate-400">Direct UPI ID:</p>
              <p className="text-xs font-mono font-bold text-lime-400">{upiId}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={copyUpiId}
                className="px-2.5 py-1.5 bg-forest-800 hover:bg-forest-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadQR}
                className="px-2.5 py-1.5 bg-forest-800 hover:bg-forest-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1 transition-colors"
                title="Download QR code image"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* Manual Verification Form */}
          {submittedMessage ? (
            <div className="bg-emerald-950/60 border border-emerald-500/50 p-4 rounded-xl text-left space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>Reference Logged for Verification</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{submittedMessage}</p>
              <button
                onClick={onClose}
                className="w-full mt-2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs"
              >
                Close & View Booking Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitUtr} className="space-y-3 pt-1">
              <div className="bg-forest-850 p-3 rounded-xl border border-forest-800 text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Important Payment Policy</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  To protect against payment spoofing, your booking is confirmed only after bank verification. Please enter your 12-digit UTR/UPI reference below after paying.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  12-Digit UPI Transaction / UTR Number *
                </label>
                <input
                  type="text"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="e.g. 429019284019"
                  className="w-full bg-forest-950 border border-forest-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lime-500 font-mono"
                  required
                />
              </div>

              {error && (
                <p className="text-xs text-red-400 bg-red-950/40 p-2 rounded-lg border border-red-800">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-lime-500 hover:bg-lime-400 text-forest-950 font-bold rounded-xl text-sm shadow-lg shadow-lime-500/20 transition-all disabled:opacity-50"
              >
                {submitting ? 'Submitting Reference...' : 'Submit UTR Reference'}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
