export const formatPrice = (val) => {
  if (val === null || val === undefined) return '';
  const numStr = val.toString().replace(/[^0-9]/g, '');
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const formatNumber = (val) => {
  if (val === null || val === undefined) return '';
  const numStr = val.toString().replace(/[^0-9]/g, '');
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const parseNumber = (val) => {
  if (val === null || val === undefined) return '';
  return val.toString().replace(/[^0-9]/g, '');
};
