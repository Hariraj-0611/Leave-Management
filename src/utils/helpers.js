export const calculateLeaveDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const checkDateOverlap = (existingLeaves, newStart, newEnd) => {
  const newStartDate = new Date(newStart);
  const newEndDate = new Date(newEnd);
  
  return existingLeaves.some(leave => {
    const existingStart = new Date(leave.startDate);
    const existingEnd = new Date(leave.endDate);
    
    return (
      (newStartDate >= existingStart && newStartDate <= existingEnd) ||
      (newEndDate >= existingStart && newEndDate <= existingEnd) ||
      (newStartDate <= existingStart && newEndDate >= existingEnd)
    );
  });
};

export const exportToCSV = (data, filename) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.click();
};