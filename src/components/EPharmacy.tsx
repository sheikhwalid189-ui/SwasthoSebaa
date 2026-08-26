import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ShieldCheck, 
  Truck, 
  Pill, 
  CheckCircle, 
  FileText,
  CreditCard,
  Check
} from 'lucide-react';
import { Medicine } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';

export const EPharmacy: React.FC = () => {
  const { language } = useLanguage();
  const { cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal, showToast } = useApp();

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+880 1');
  const [customerName, setCustomerName] = useState('');
  const [paymentOption, setPaymentOption] = useState<'cod' | 'bkash' | 'nagad'>('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, [selectedCategory]);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      let url = '/api/medicines?';
      if (selectedCategory !== 'All') url += `category=${encodeURIComponent(selectedCategory)}&`;
      if (searchTerm) url += `query=${encodeURIComponent(searchTerm)}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setMedicines(data.data);
      }
    } catch (err) {
      console.error('Failed to load medicines:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMedicines();
  };

  const categories = [
    'All',
    'Pain Relief & Fever',
    'Gastric & Acidity',
    'Asthma & Allergy',
    'Cardiovascular / Blood Pressure',
    'Diabetes Care',
    'Antibiotic',
    'Hydration & Electrolytes'
  ];

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !deliveryAddress) {
      alert('Please complete all required shipping fields');
      return;
    }

    setOrderPlaced(true);
    showToast('Medicine Order Placed Successfully! Delivery in 2-4 hours.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-teal-600" />
            <span>{language === 'bn' ? 'স্বাস্হ্যসেবা ই-ফার্মেসি ও ঔষধ হোম ডেলিভারি' : 'SwasthoSeba E-Pharmacy & Doorstep Delivery'}</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            {language === 'bn'
              ? '১০০% আসল ও রেজিস্টার্ড ঔষধ, সঠিক তাপমাত্রায় সংরক্ষিত এবং মাত্র ২-৪ ঘণ্টায় দ্রুত হোম ডেলিভারি।'
              : '100% genuine registered pharmaceuticals delivered directly to your doorstep within 2-4 hours.'}
          </p>
        </div>

        {/* Fast Delivery Badge */}
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-900 px-4 py-2 rounded-2xl border border-emerald-200 text-xs font-bold shrink-0">
          <Truck className="w-4 h-4 text-emerald-600 animate-bounce" />
          <span>{language === 'bn' ? 'ঢাকা সিটিতে ২-৪ ঘণ্টায় ডেলিভারি' : '2-4 Hour Express Delivery'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
        
        {/* Left Medicine Catalog (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Search & Category filter */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={language === 'bn' ? 'ঔষধের নাম বা জেনেরিক লিখে খুঁজুন (যেমন: Napa, Sergel, Fexo...)' : 'Search medicine by brand or generic name...'}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs"
              >
                {language === 'bn' ? 'খুঁজুন' : 'Search'}
              </button>
            </form>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {categories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 px-3 py-1.5 rounded-xl font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Medicine Cards List */}
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              <div className="inline-block w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2">Loading Medicines Catalog...</p>
            </div>
          ) : medicines.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
              <Pill className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h4 className="font-bold text-slate-800 text-sm">No medicines found matching criteria</h4>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {medicines.map((med) => (
                <div
                  key={med.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                        {med.category}
                      </span>
                      {med.prescriptionRequired && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          Rx Required
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">{med.brandName}</h4>
                      <p className="text-xs text-teal-700 font-semibold">{med.genericName}</p>
                      <p className="text-[11px] text-slate-500">{med.manufacturer}</p>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-600 space-y-1">
                      <p><strong>Dose:</strong> {med.dosage}</p>
                      <p className="line-clamp-1"><strong>For:</strong> {med.indications}</p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-base font-extrabold text-slate-900">৳ {med.price}</span>
                      <span className="text-[10px] text-slate-400 block">{med.unit}</span>
                    </div>

                    <button
                      onClick={() => addToCart(med)}
                      className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1.5 transition-transform active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'অর্ডার করুন' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right Shopping Cart Summary (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs sticky top-24 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {language === 'bn' ? 'ঔষধ কার্ট' : 'Pharmacy Cart'}
                </h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 bg-teal-100 text-teal-800 rounded-full">
                {cart.length} Items
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="py-10 text-center text-slate-400 space-y-2">
                <Pill className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs">{language === 'bn' ? 'আপনার কার্ট খালি রয়েছে।' : 'Your medicine cart is empty.'}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
                  {cart.map((item) => (
                    <div key={item.medicine.id} className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="min-w-0 flex-1">
                        <h5 className="font-bold text-slate-900 truncate">{item.medicine.brandName}</h5>
                        <span className="text-slate-500 text-[11px]">৳{item.medicine.price} × {item.quantity}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateCartQuantity(item.medicine.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100"
                        >
                          -
                        </button>
                        <span className="w-4 text-center font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.medicine.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.medicine.id)}
                          className="text-rose-500 hover:text-rose-700 ml-1 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal & Delivery Details */}
                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Medicines Subtotal:</span>
                    <span className="font-bold text-slate-900">৳ {cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Fee:</span>
                    <span className="text-emerald-700 font-bold">{cartTotal > 499 ? 'FREE (ঢাকা)' : '৳ 50'}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1 border-t">
                    <span>Total Payable:</span>
                    <span className="text-teal-700">৳ {cartTotal > 499 ? cartTotal : cartTotal + 50}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all"
                >
                  {language === 'bn' ? 'অর্ডার সম্পন্ন করুন' : 'Proceed to Checkout'}
                </button>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-slate-900 text-base">
                {language === 'bn' ? 'ঔষধ ডেলিভারি ও পেমেন্ট' : 'Medicine Shipping & Payment'}
              </h4>
              <button onClick={() => { setIsCheckoutOpen(false); setOrderPlaced(false); }} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            {orderPlaced ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900">
                    {language === 'bn' ? 'অর্ডার সফলভাবে গ্রহণ করা হয়েছে!' : 'Order Placed Successfully!'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {language === 'bn'
                      ? 'আপনার ঠিকানায় ২-৪ ঘণ্টার মধ্যে আমাদের ডেলিভারি প্রতিনিধি পৌঁছাবে।'
                      : 'Our dispatch rider will arrive at your provided address within 2-4 hours.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    clearCart();
                    setIsCheckoutOpen(false);
                    setOrderPlaced(false);
                  }}
                  className="px-6 py-2.5 bg-teal-600 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Recipient name"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+880 1712-345678"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Delivery Address *</label>
                  <textarea
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="House, Road, Area, Thana, District"
                    className="w-full p-2.5 rounded-xl border border-slate-300"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'cod', label: 'Cash on Delivery' },
                      { id: 'bkash', label: 'bKash Online' },
                      { id: 'nagad', label: 'Nagad Online' }
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPaymentOption(p.id as any)}
                        className={`p-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                          paymentOption === p.id
                            ? 'border-teal-600 bg-teal-50 text-teal-900 ring-1 ring-teal-500'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md"
                  >
                    Confirm Order (৳{cartTotal > 499 ? cartTotal : cartTotal + 50})
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
