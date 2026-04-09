import React from 'react';
import AffiliateDashboard from './AffiliateDashboard';
import AffiliateManagement from './AffiliateManagement';

export default function Affiliate() {
  // 1. Ambil data user dari Local Storage
  const adminData = JSON.parse(localStorage.getItem("okai_admin"));
  
  // 2. Cek Role (Pastikan huruf kecil biar aman)
  const role = adminData?.role?.toLowerCase();

  // 3. Routing Komponen
  if (role === 'affiliate') {
    return <AffiliateDashboard />;
  }

  // Jika yang login Super Admin atau Admin Operasional
  return <AffiliateManagement />;
}