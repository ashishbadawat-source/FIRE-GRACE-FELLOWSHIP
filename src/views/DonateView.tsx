/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Flame,
  Heart,
  CreditCard,
  Building,
  QrCode,
  CheckCircle,
  Copy,
  ExternalLink,
  Shield,
  Printer,
  Sparkles,
  ArrowRight,
  Info,
  DollarSign,
  Send,
  Download,
  FileText,
  Clock,
  MapPin,
  HelpCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { ChurchPaymentDetails, DonationRecord, FundType, PaymentChannel } from '../types';

interface DonateViewProps {
  onNavigate: (view: string) => void;
}

const FUND_OPTIONS: { id: FundType; label: string; scripture: string; desc: string; icon: string }[] = [
  {
    id: 'tithe',
    label: 'Holy Tithe (10%)',
    scripture: 'Malachi 3:10',
    desc: 'Honoring God with the firstfruits of all your increase for covenant blessings.',
    icon: '🕊️',
  },
  {
    id: 'offering',
    label: 'Sunday Worship Offering',
    scripture: '2 Corinthians 9:7',
    desc: 'General ministry support, worship equipment, media broadcast, and sanctuary upkeep.',
    icon: '🙏',
  },
  {
    id: 'building',
    label: 'Cathedral & Building Fund',
    scripture: 'Haggai 1:8',
    desc: 'Expanding our worship sanctuary, youth center, and global broadcasting studio.',
    icon: '⛪',
  },
  {
    id: 'missions',
    label: 'Global Missions & Evangelism',
    scripture: 'Mark 16:15',
    desc: 'Sponsoring rural evangelism, gospel crusades, Bible printing, and missionary families.',
    icon: '🌍',
  },
  {
    id: 'thanksgiving',
    label: 'Thanksgiving & Miracle Seed',
    scripture: 'Psalm 100:4',
    desc: 'A sacrificial seed of gratitude celebrating God’s answered prayer and breakthroughs.',
    icon: '🔥',
  },
  {
    id: 'charity',
    label: 'Widows, Orphans & Poor Relief',
    scripture: 'James 1:27',
    desc: 'Providing emergency food rations, medical aid, and shelter to families in crisis.',
    icon: '❤️',
  },
];

const PRESET_AMOUNTS: Record<string, number[]> = {
  USD: [25, 50, 100, 250, 500, 1000],
  INR: [500, 1000, 2500, 5000, 10000, 25000],
  EUR: [20, 50, 100, 200, 500, 1000],
  GBP: [20, 50, 100, 200, 500, 1000],
};

export const DonateView: React.FC<DonateViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  // Payment data from backend
  const [paymentDetails, setPaymentDetails] = useState<ChurchPaymentDetails | null>(null);
  const [activeChannel, setActiveChannel] = useState<PaymentChannel>('google_pay');

  // Donation form & selection
  const [currency, setCurrency] = useState<'USD' | 'INR' | 'EUR' | 'GBP'>('USD');
  const [selectedFund, setSelectedFund] = useState<FundType>('tithe');
  const [amount, setAmount] = useState<number | string>(100);
  const [customAmount, setCustomAmount] = useState<string>('');

  // Confirmation form inputs
  const [donorName, setDonorName] = useState(user?.fullName || '');
  const [donorEmail, setDonorEmail] = useState(user?.email || '');
  const [donorPhone, setDonorPhone] = useState(user?.mobile || '');
  const [transactionRef, setTransactionRef] = useState('');
  const [prayerNotes, setPrayerNotes] = useState('');

  // Submission state & receipt
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<DonationRecord | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    api.getPaymentDetails().then(res => {
      if (res.paymentDetails) {
        setPaymentDetails(res.paymentDetails);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      if (!donorName) setDonorName(user.fullName);
      if (!donorEmail) setDonorEmail(user.email);
      if (!donorPhone) setDonorPhone(user.mobile);
    }
  }, [user]);

  // Adjust default preset amount when currency changes
  const handleCurrencyChange = (newCur: 'USD' | 'INR' | 'EUR' | 'GBP') => {
    setCurrency(newCur);
    if (newCur === 'INR') {
      setAmount(1000);
    } else {
      setAmount(100);
    }
    setCustomAmount('');
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const currentAmountNum = customAmount ? parseFloat(customAmount) || 0 : typeof amount === 'number' ? amount : 0;

  // UPI deep link for mobile Google Pay & PhonePe
  const getUpiDeepLink = (pa: string, pn: string) => {
    const encodedPn = encodeURIComponent(pn);
    const encodedNote = encodeURIComponent(`Fire Grace ${selectedFund.toUpperCase()} - ${donorName || 'Believer'}`);
    const amtStr = currentAmountNum > 0 ? `&am=${currentAmountNum}` : '';
    const curCode = currency === 'INR' ? 'INR' : 'USD';
    return `upi://pay?pa=${pa}&pn=${encodedPn}&tn=${encodedNote}${amtStr}&cu=${curCode}`;
  };

  const handleSubmitConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || !donorEmail.trim()) {
      alert('Please provide your name and email address for the tax-exempt receipt.');
      return;
    }
    if (currentAmountNum <= 0) {
      alert('Please select or specify a valid contribution amount.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitDonation({
        donorName: donorName.trim(),
        donorEmail: donorEmail.trim(),
        donorPhone: donorPhone.trim(),
        amount: currentAmountNum,
        currency,
        fundType: selectedFund,
        paymentMethod: activeChannel,
        transactionReference: transactionRef.trim() || `UTR-${Date.now().toString().slice(-8)}`,
        notes: prayerNotes.trim(),
      });

      setSuccessReceipt(res.donation);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } catch (err: any) {
      alert(err.message || 'Failed to record donation confirmation. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const gpayUpi = paymentDetails?.googlePay.upiId || 'firegrace@okaxis';
  const gpayNumber = paymentDetails?.googlePay.number || '+1 (555) 777-FIRE';
  const phonepeUpi = paymentDetails?.phonePe.upiId || 'firegracefellowship@ybl';
  const phonepeNumber = paymentDetails?.phonePe.number || '+91 98765 43210';
  const bankAcc = paymentDetails?.bankAccount || {
    bankName: 'Grace Federal & Kingdom Trust Bank / State Bank Partner',
    accountName: 'FIRE & GRACE FELLOWSHIP TRUST',
    accountNumber: '7770099881234',
    accountType: 'Current / Non-Profit Religious Trust Account',
    ifscCode: 'FGFB0007777',
    routingNumber: '122000496',
    swiftBic: 'FGFBUS33',
    branchName: 'Cathedral Plaza Central Branch, 777 Grace Way, Los Angeles, CA 90001',
  };

  return (
    <div id="donate-page" className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      {/* ----------------- HERO HEADER & SCRIPTURE ----------------- */}
      <div className="max-w-4xl mx-auto text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          Kingdom Stewardship & Covenant Sowing
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-cinzel text-white tracking-wide">
          Online Giving & <span className="text-amber-400">Tithes</span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Partner with Fire & Grace Fellowship as we declare the gospel, rescue souls, heal the broken-hearted, and prepare the bride of Christ across the nations.
        </p>

        {/* Golden Scripture Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border border-amber-500/30 text-center max-w-2xl mx-auto shadow-xl relative overflow-hidden">
          <p className="text-xs sm:text-sm italic font-serif text-amber-200 leading-relaxed">
            “Bring all the tithes into the storehouse, that there may be food in My house, and try Me now in this,” says the Lord of hosts, “if I will not open for you the windows of heaven and pour out for you such blessing that there will not be room enough to receive it.”
          </p>
          <span className="text-[11px] font-bold text-amber-400 tracking-wider block mt-2 font-mono">
            — MALACHI 3:10 (NKJV)
          </span>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 pt-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
            <Shield className="w-3.5 h-3.5 text-emerald-400" /> 501(c)(3) Tax-Exempt Status
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
            <CheckCircle className="w-3.5 h-3.5 text-amber-400" /> Instant Digital Tax Receipt
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> 100% Direct Ministry Impact
          </span>
        </div>
      </div>

      {/* ----------------- MAIN GIVING PORTAL GRID ----------------- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: GIVING DETAILS & PAYMENT CHANNELS (Col 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: FUND SELECTOR */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold font-cinzel text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-bold font-mono">
                  1
                </span>
                Choose Giving Designation
              </h2>
              <span className="text-[11px] text-amber-400 font-mono">Select Fund</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FUND_OPTIONS.map(fund => (
                <button
                  key={fund.id}
                  type="button"
                  onClick={() => setSelectedFund(fund.id)}
                  className={`p-3.5 rounded-2xl text-left transition border flex flex-col justify-between relative ${
                    selectedFund === fund.id
                      ? 'bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xl">{fund.icon}</span>
                    <span className="text-[10px] font-mono text-amber-400/80 bg-amber-400/10 px-2 py-0.5 rounded">
                      {fund.scripture}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white">{fund.label}</h3>
                    <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-tight">{fund.desc}</p>
                  </div>
                  {selectedFund === fund.id && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2: AMOUNT SELECTOR & CURRENCY */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold font-cinzel text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-bold font-mono">
                  2
                </span>
                Select or Enter Seed Amount
              </h2>

              {/* Currency Selector */}
              <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs font-mono font-bold">
                {(['USD', 'INR', 'EUR', 'GBP'] as const).map(cur => (
                  <button
                    key={cur}
                    onClick={() => handleCurrencyChange(cur)}
                    className={`px-2.5 py-1 rounded transition ${
                      currency === cur ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cur}
                  </button>
                ))}
              </div>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_AMOUNTS[currency]?.map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    setAmount(val);
                    setCustomAmount('');
                  }}
                  className={`py-2.5 px-2 rounded-xl text-center text-xs font-bold font-mono transition border ${
                    !customAmount && amount === val
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$'}
                  {val.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm font-bold">
                {currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$'}
              </span>
              <input
                type="number"
                min="1"
                step="any"
                placeholder="Or enter custom faith offering amount..."
                value={customAmount}
                onChange={e => setCustomAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:outline-none text-white font-mono text-sm placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* STEP 3: PAYMENT METHOD TABS (GOOGLE PAY / PHONEPE / BANK ACCOUNT / QR) */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold font-cinzel text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-bold font-mono">
                  3
                </span>
                Choose Giving Channel
              </h2>
              <span className="text-[11px] text-slate-400">Zero Processing Deductions</span>
            </div>

            {/* Tab Navigation Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Google Pay */}
              <button
                type="button"
                onClick={() => setActiveChannel('google_pay')}
                className={`p-3 rounded-2xl text-center transition border flex flex-col items-center gap-1.5 ${
                  activeChannel === 'google_pay'
                    ? 'bg-gradient-to-b from-blue-950/60 to-slate-900 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center p-1">
                  <span className="font-extrabold text-[11px] text-blue-600 tracking-tighter">GPay</span>
                </div>
                <span className="text-xs font-bold">Google Pay</span>
              </button>

              {/* PhonePe */}
              <button
                type="button"
                onClick={() => setActiveChannel('phone_pe')}
                className={`p-3 rounded-2xl text-center transition border flex flex-col items-center gap-1.5 ${
                  activeChannel === 'phone_pe'
                    ? 'bg-gradient-to-b from-purple-950/60 to-slate-900 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#5f259f] flex items-center justify-center text-white font-bold text-xs">
                  पे
                </div>
                <span className="text-xs font-bold">PhonePe</span>
              </button>

              {/* Bank Account */}
              <button
                type="button"
                onClick={() => setActiveChannel('bank_transfer')}
                className={`p-3 rounded-2xl text-center transition border flex flex-col items-center gap-1.5 ${
                  activeChannel === 'bank_transfer'
                    ? 'bg-gradient-to-b from-amber-950/60 to-slate-900 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Building className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">Bank Account</span>
              </button>

              {/* Instant QR Code */}
              <button
                type="button"
                onClick={() => setActiveChannel('upi_qr')}
                className={`p-3 rounded-2xl text-center transition border flex flex-col items-center gap-1.5 ${
                  activeChannel === 'upi_qr'
                    ? 'bg-gradient-to-b from-emerald-950/60 to-slate-900 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <QrCode className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold">Scan QR Code</span>
              </button>
            </div>

            {/* TAB 1: GOOGLE PAY CONTENT */}
            {activeChannel === 'google_pay' && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-blue-500/30 space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 text-xs font-bold font-mono">
                      GOOGLE PAY (GPAY)
                    </span>
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Verified Non-Profit
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">Merchant Account</span>
                </div>

                {/* Primary UPI ID Box */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Google Pay UPI ID</span>
                    <span className="text-sm sm:text-base font-mono font-bold text-amber-300">{gpayUpi}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText(gpayUpi, 'gpay_upi')}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    {copiedField === 'gpay_upi' ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy ID
                      </>
                    )}
                  </button>
                </div>

                {/* GPay Mobile Phone Number */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">GPay Mobile Number</span>
                    <span className="text-sm font-mono text-white">{gpayNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText(gpayNumber, 'gpay_num')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    {copiedField === 'gpay_num' ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Number
                      </>
                    )}
                  </button>
                </div>

                {/* Direct Mobile Deep Link Button */}
                <div className="pt-1">
                  <a
                    href={getUpiDeepLink(gpayUpi, 'Fire & Grace Fellowship')}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Google Pay & Sowing Seed ({currency} {currentAmountNum})
                  </a>
                  <p className="text-[10px] text-slate-400 text-center mt-2">
                    *Tap button on mobile device to launch Google Pay app with pre-filled details.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: PHONEPE CONTENT */}
            {activeChannel === 'phone_pe' && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-300 text-xs font-bold font-mono">
                      PHONEPE (PHONE PAY)
                    </span>
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Verified Non-Profit
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">Direct UPI</span>
                </div>

                {/* Primary UPI ID Box */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">PhonePe UPI ID</span>
                    <span className="text-sm sm:text-base font-mono font-bold text-amber-300">{phonepeUpi}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText(phonepeUpi, 'phonepe_upi')}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    {copiedField === 'phonepe_upi' ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy ID
                      </>
                    )}
                  </button>
                </div>

                {/* PhonePe Registered Mobile Number */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-mono">Registered PhonePe Mobile</span>
                    <span className="text-sm font-mono text-white">{phonepeNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText(phonepeNumber, 'phonepe_num')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    {copiedField === 'phonepe_num' ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Number
                      </>
                    )}
                  </button>
                </div>

                {/* Direct Mobile Deep Link Button */}
                <div className="pt-1">
                  <a
                    href={getUpiDeepLink(phonepeUpi, 'Fire & Grace Fellowship')}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open PhonePe App & Give ({currency} {currentAmountNum})
                  </a>
                  <p className="text-[10px] text-slate-400 text-center mt-2">
                    *Tap on smartphone to trigger the PhonePe transaction screen directly.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: BANK ACCOUNT TRANSFER CONTENT */}
            {activeChannel === 'bank_transfer' && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold font-mono">
                    OFFICIAL CHURCH BANK ACCOUNT
                  </span>
                  <span className="text-xs text-slate-400">NEFT / IMPS / RTGS / ACH / SWIFT</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Account Name */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Beneficiary Account Name</span>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white font-mono truncate">{bankAcc.accountName}</span>
                      <button
                        type="button"
                        onClick={() => copyText(bankAcc.accountName, 'acc_name')}
                        className="text-amber-400 hover:text-amber-300"
                        title="Copy"
                      >
                        {copiedField === 'acc_name' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Account Number */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Account Number</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-amber-300 text-sm tracking-wider">{bankAcc.accountNumber}</span>
                      <button
                        type="button"
                        onClick={() => copyText(bankAcc.accountNumber, 'acc_num')}
                        className="text-amber-400 hover:text-amber-300"
                        title="Copy"
                      >
                        {copiedField === 'acc_num' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Bank Name */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Bank Name</span>
                    <span className="font-bold text-slate-200 block">{bankAcc.bankName}</span>
                  </div>

                  {/* Account Type */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Account Type</span>
                    <span className="font-bold text-slate-200 block">{bankAcc.accountType}</span>
                  </div>

                  {/* IFSC Code (India / Asia) */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">IFSC Code (India NEFT/RTGS)</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-emerald-400 text-sm">{bankAcc.ifscCode}</span>
                      <button
                        type="button"
                        onClick={() => copyText(bankAcc.ifscCode, 'ifsc')}
                        className="text-amber-400 hover:text-amber-300"
                        title="Copy"
                      >
                        {copiedField === 'ifsc' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Routing Number (US / Canada) */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">US Routing / ACH Number</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-emerald-400 text-sm">{bankAcc.routingNumber || '122000496'}</span>
                      <button
                        type="button"
                        onClick={() => copyText(bankAcc.routingNumber || '122000496', 'routing')}
                        className="text-amber-400 hover:text-amber-300"
                        title="Copy"
                      >
                        {copiedField === 'routing' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* SWIFT / BIC Code (International Wire) */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 sm:col-span-2">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">
                      SWIFT / BIC Code (International Donors Worldwide)
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-amber-300 text-sm">{bankAcc.swiftBic || 'FGFBUS33'}</span>
                      <button
                        type="button"
                        onClick={() => copyText(bankAcc.swiftBic || 'FGFBUS33', 'swift')}
                        className="text-amber-400 hover:text-amber-300"
                        title="Copy"
                      >
                        {copiedField === 'swift' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Branch Details */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1 sm:col-span-2">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Branch Address</span>
                    <p className="text-xs text-slate-300">{bankAcc.branchName}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: INSTANT QR CODE CONTENT */}
            {activeChannel === 'upi_qr' && (
              <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center space-y-5">
                <div className="space-y-1">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono">
                    ALL-IN-ONE UPI & SCANNER QR CODE
                  </span>
                  <p className="text-xs text-slate-400">
                    Scan with Google Pay, PhonePe, Paytm, BHIM, or any UPI & Mobile Banking app
                  </p>
                </div>

                {/* QR Code Presentation Box */}
                <div className="inline-block p-4 rounded-2xl bg-white shadow-2xl border-4 border-amber-400/80 relative group">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
                      `upi://pay?pa=${gpayUpi}&pn=Fire%20Grace%20Fellowship&cu=${currency === 'INR' ? 'INR' : 'USD'}`
                    )}`}
                    alt="Fire Grace Fellowship QR Code"
                    className="w-56 h-56 mx-auto object-contain rounded-lg"
                  />
                  <div className="mt-2 text-center">
                    <span className="text-[11px] font-bold text-slate-950 block font-cinzel">FIRE GRACE FELLOWSHIP</span>
                    <span className="text-[10px] font-mono text-slate-600 block">{gpayUpi}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => copyText(gpayUpi, 'qr_upi')}
                    className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-amber-300 hover:bg-slate-800 font-semibold flex items-center gap-1.5 transition"
                  >
                    {copiedField === 'qr_upi' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy UPI ID ({gpayUpi})
                  </button>

                  <a
                    href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(
                      `upi://pay?pa=${gpayUpi}&pn=Fire%20Grace%20Fellowship&cu=${currency === 'INR' ? 'INR' : 'USD'}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-300 hover:bg-emerald-500/30 font-semibold flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Printable QR
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: GIVING CONFIRMATION & OFFICIAL RECEIPT (Col 5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* CONFIRMATION & TAX RECEIPT FORM */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-2xl space-y-5 relative">
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base sm:text-lg font-bold font-cinzel text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                Confirm Giving & Get Tax Receipt
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Completed your transfer via Google Pay, PhonePe, or Bank? Record your reference to generate your official electronic receipt.
              </p>
            </div>

            <form onSubmit={handleSubmitConfirmation} className="space-y-4 text-xs">
              {/* Summary of Selection */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Selected Designation</span>
                  <span className="font-bold text-white text-xs capitalize">
                    {FUND_OPTIONS.find(f => f.id === selectedFund)?.label}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Amount</span>
                  <span className="font-bold text-amber-400 text-sm font-mono">
                    {currency} {currentAmountNum.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Donor Name */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300 font-semibold uppercase font-mono">
                  Full Legal Name (For Receipt) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Johnathan & Sarah Emmanuel"
                  value={donorName}
                  onChange={e => setDonorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:outline-none text-white"
                />
              </div>

              {/* Donor Email */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300 font-semibold uppercase font-mono">
                  Email Address (Receipt Destination) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={donorEmail}
                  onChange={e => setDonorEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:outline-none text-white"
                />
              </div>

              {/* Donor Phone */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300 font-semibold uppercase font-mono">
                  Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={donorPhone}
                  onChange={e => setDonorPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:outline-none text-white"
                />
              </div>

              {/* Payment Channel Used */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300 font-semibold uppercase font-mono">
                  Payment Method Used *
                </label>
                <select
                  value={activeChannel}
                  onChange={e => setActiveChannel(e.target.value as PaymentChannel)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:outline-none text-white font-mono text-xs"
                >
                  <option value="google_pay">Google Pay (GPay / UPI)</option>
                  <option value="phone_pe">PhonePe (Phone Pay / UPI)</option>
                  <option value="bank_transfer">Bank Account Wire / NEFT / IMPS / ACH</option>
                  <option value="upi_qr">Scan QR Code (Paytm / BHIM / Banking App)</option>
                </select>
              </div>

              {/* Transaction Reference / UTR */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300 font-semibold uppercase font-mono">
                  Transaction ID / UTR / Reference No.
                </label>
                <input
                  type="text"
                  placeholder="e.g. 423981290382 or UPI Ref"
                  value={transactionRef}
                  onChange={e => setTransactionRef(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:outline-none text-white font-mono text-xs"
                />
                <span className="text-[10px] text-slate-400">
                  Optional: Check your Google Pay/PhonePe/Bank app receipt for the reference number.
                </span>
              </div>

              {/* Prayer Petition Note */}
              <div className="space-y-1">
                <label className="text-[11px] text-slate-300 font-semibold uppercase font-mono">
                  Prayer Agreement / Seed Declaration
                </label>
                <textarea
                  rows={2}
                  placeholder="Any specific prayer request or thanksgiving testimony attached to this offering..."
                  value={prayerNotes}
                  onChange={e => setPrayerNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-400 focus:outline-none text-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    Generating Official Receipt...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Confirm Giving & Generate Receipt
                  </>
                )}
              </button>
            </form>
          </div>

          {/* SUCCESS MODAL / PRINTABLE TAX RECEIPT CARD */}
          {successReceipt && (
            <div
              id="printable-receipt"
              className="p-6 rounded-3xl bg-slate-900 border-2 border-emerald-500/50 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-300 text-slate-100"
            >
              {/* Receipt Header */}
              <div className="text-center pb-4 border-b border-slate-800 space-y-1">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-2">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
                  OFFICIAL TAX-EXEMPT GIVING RECEIPT
                </span>
                <h3 className="text-lg font-bold font-cinzel text-white">FIRE GRACE FELLOWSHIP</h3>
                <p className="text-[10px] text-slate-400">
                  777 Grace Cathedral Way, Los Angeles, CA 90001 • 501(c)(3) Org #95-4872190
                </p>
              </div>

              {/* Receipt Body */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Receipt Number:</span>
                  <span className="font-mono font-bold text-amber-300">{successReceipt.receiptNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Date Issued:</span>
                  <span className="font-mono text-slate-300">{new Date(successReceipt.date).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Donor Name:</span>
                  <span className="font-bold text-white">{successReceipt.donorName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Designation / Fund:</span>
                  <span className="font-bold text-emerald-300 uppercase font-mono">{successReceipt.fundType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Payment Channel:</span>
                  <span className="font-mono text-slate-300 uppercase">{successReceipt.paymentMethod.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Reference / UTR:</span>
                  <span className="font-mono text-slate-300 text-[11px]">{successReceipt.transactionReference}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700 bg-slate-950/60 px-3 rounded-lg">
                  <span className="text-slate-200 font-bold">Total Seed Sown:</span>
                  <span className="font-mono font-extrabold text-amber-400 text-base">
                    {successReceipt.currency} {successReceipt.amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Pastoral Blessing Signature */}
              <div className="pt-2 text-center text-[10px] text-slate-400 space-y-1">
                <p className="italic font-serif text-amber-200/90">
                  “The Lord bless you and keep you; the Lord make His face shine upon you and give you peace.”
                </p>
                <p className="font-semibold text-slate-300">— Pastor David Emmanuel, Senior Pastor</p>
              </div>

              {/* Action Buttons: Print & Member Dashboard */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" /> Print Receipt / PDF
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate(user?.role === 'admin' ? 'admin' : 'dashboard')}
                  className="flex-1 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  View in Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ----------------- GIVING FAQS & ASSURANCES ----------------- */}
      <div className="max-w-4xl mx-auto pt-10 border-t border-slate-800/80 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold font-cinzel text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Everything you need to know about giving at Fire & Grace Fellowship</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
            <h3 className="font-bold text-amber-300 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
              Is my donation tax-deductible?
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Yes! Fire & Grace Fellowship is an officially registered non-profit 501(c)(3) religious charity. All contributions are tax-deductible to the fullest extent permitted by law.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
            <h3 className="font-bold text-amber-300 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
              Can I give using Google Pay or PhonePe from anywhere?
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Yes. You can copy our verified UPI ID (<span className="text-amber-300 font-mono">{gpayUpi}</span> or <span className="text-amber-300 font-mono">{phonepeUpi}</span>) or scan the all-in-one QR code using any UPI app or international banking gateway.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
            <h3 className="font-bold text-amber-300 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
              How do I send money via Bank Wire Transfer?
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Simply use the Account Number <span className="text-amber-300 font-mono">7770099881234</span> with IFSC Code <span className="text-amber-300 font-mono">FGFB0007777</span> (for domestic transfers) or SWIFT Code <span className="text-amber-300 font-mono">FGFBUS33</span> (for international wire).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
            <h3 className="font-bold text-amber-300 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
              How do I receive an annual contribution statement?
            </h3>
            <p className="text-slate-400 leading-relaxed">
              When logged into your Fire & Grace Member Portal, you can access your giving history and download consolidated annual tax statements anytime with a single click.
            </p>
          </div>
        </div>

        {/* Pastoral Assurance Footer */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border border-amber-500/20 text-center text-xs text-slate-300 space-y-1">
          <span className="font-bold text-amber-300">Need personal assistance or have questions regarding large grants or legacy giving?</span>
          <p className="text-slate-400">
            Contact our Church Treasury Council directly at{' '}
            <a href="mailto:treasury@firegracefellowship.org" className="text-amber-400 hover:underline">
              treasury@firegracefellowship.org
            </a>{' '}
            or call our pastoral line at{' '}
            <span className="text-slate-200 font-mono">+1 (800) 555-FIRE</span>.
          </p>
        </div>
      </div>
    </div>
  );
};
