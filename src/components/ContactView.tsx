import React, { useState } from 'react';
import { Phone, MessageSquare, Mail, MapPin, Send, HelpCircle } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface ContactViewProps {
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function ContactView({ addToast }: ContactViewProps) {
  const phone = '+201102140676';
  const displayPhone = '+20 11 0214 0676';

  const [name, setName] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phoneInput.trim() || !message.trim()) {
      addToast('يرجى ملء جميع الحقول المطلوبة', 'error');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'contactInquiries'), {
        name: name.trim(),
        phone: phoneInput.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString(),
      });
      addToast('تم إرسال رسالتك لمستر عبدالله سيد بنجاح! سيتم التواصل معك قريباً.', 'success');
      setName('');
      setPhoneInput('');
      setMessage('');
    } catch (err) {
      console.error(err);
      addToast('حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة لاحقاً.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 py-16 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">
            تواصل معنا
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            يسعدنا الرد على استفساراتكم وحل جميع المشكلات التي قد تواجهكم في أسرع وقت.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Quick Contact Info */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-950 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">معلومات الاتصال المباشر</h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                يمكنك التحدث مباشرة مع المستر أو فريق الدعم لتنشيط حسابك أو حل مشاكل تشغيل الفيديوهات وتسجيل الدخول.
              </p>

              {/* Standard notification required by prompt */}
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold text-amber-600 dark:text-amber-400">إذا واجهت أي مشكلة أو أردت تجديد الاشتراك، تواصل مع مستر عبدالله سيد على الرقم:</span>
                <div className="mt-2 text-lg font-bold text-blue-600 dark:text-blue-400 text-center sm:text-right select-all">
                  {displayPhone}
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href={`tel:${phone}`}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Phone className="w-5 h-5" />
                  اتصل الآن بالهاتف
                </a>
                <a
                  href={`https://wa.me/${phone.replace('+', '')}`}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5" />
                  تواصل عبر واتساب
                </a>
              </div>
            </div>

            {/* Other details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md flex items-start gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl text-blue-600">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">البريد الإلكتروني</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">support@mr-abdullah.com</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-md flex items-start gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl text-blue-600">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">مقر التدريس والمجموعات</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">القاهرة، جمهورية مصر العربية</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-slate-950 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">أرسل رسالة سريعة</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              سجل استفسارك وسنعاود الاتصال بك هاتفياً في أقرب فرصة ممكنة.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">الاسم بالكامل *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none text-right"
                  placeholder="محمد أحمد علي"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">رقم الهاتف أو واتساب *</label>
                <input
                  type="tel"
                  required
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none text-left"
                  placeholder="+20 123 456 7890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">نص الرسالة أو الاستفسار *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none text-right"
                  placeholder="اكتب رسالتك أو مشكلتك بالتفصيل هنا..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Send className="w-5 h-5 rotate-180" />
                    إرسال الرسالة للمستشار
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
