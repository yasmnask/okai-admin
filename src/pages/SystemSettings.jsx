import React from 'react';
import { Settings, Globe, Key, Power, Image as ImageIcon, Save } from 'lucide-react';

export default function SystemSettings() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-black mb-2 text-[#1E293B]">System <span className="text-[#E65100]">Settings</span></h1>
      <p className="text-slate-400 text-sm mb-10 font-medium italic">Konfigurasi global platform e-commerce PT Otak Kanan</p>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* 1. General Configuration */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-6 border-b pb-4 border-slate-50">
            <Globe size={18} className="text-[#E65100]" /> General Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Site Name</label>
              <input type="text" className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none" placeholder="PT Otak Kanan E-commerce" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 text-center">Logo</label>
                <div className="border-2 border-dashed border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-slate-300">
                  <ImageIcon size={24} className="mb-2" />
                  <span className="text-[10px] font-bold">Upload Logo</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 text-center">Favicon</label>
                <div className="border-2 border-dashed border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center text-slate-300">
                  <ImageIcon size={24} className="mb-2" />
                  <span className="text-[10px] font-bold">Upload Favicon</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. API Keys Management */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-6 border-b pb-4 border-slate-50">
            <Key size={18} className="text-[#E65100]" /> API Keys Management
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Payment Gateway API Key</label>
              <input type="password" password="true" className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none" placeholder="sk_test_••••••••••••" />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Shipping API (JNE/TIKI)</label>
              <input type="password" password="true" className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-orange-500/20 outline-none" placeholder="ship_api_••••••••••••" />
            </div>
          </div>
        </div>

        {/* 3. Maintenance Mode Toggle */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                <Power size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Maintenance Mode</h3>
                <p className="text-xs text-slate-400 font-medium italic">Matikan akses publik saat sedang melakukan perbaikan sistem.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#E65100]"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <button className="flex items-center gap-2 px-10 py-4 bg-[#E65100] text-white font-black rounded-3xl shadow-xl shadow-orange-100 hover:scale-105 transition-transform">
          <Save size={20} /> Simpan Konfigurasi
        </button>
      </div>
    </div>
  );
}