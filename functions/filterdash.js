function filterAndCountConsultantsAndCategories(dataArray, startDate, endDate, filial) {
 const categoryCounts = {};
 const consultorCounts = {};
 const filteredData = dataArray.filter(item => {
  return item.data >= startDate && item.data <= endDate && item.filial === filial;
 });

 filteredData.forEach(item => {
  const category = item.categoria;
  if (categoryCounts[category]) {
   categoryCounts[category]++;
  } else {
   categoryCounts[category] = 1;
  }

  const consultor = item.consultor;
  if (consultorCounts[consultor]) {
   consultorCounts[consultor]++;
  } else {
   consultorCounts[consultor] = 1;
  }
 });

 return {
  consultorCounts,
  categoryCounts
 } 
};


module.exports = {
 filterAndCountConsultantsAndCategories,
};