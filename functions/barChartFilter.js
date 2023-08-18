const barChartFilter = (dataArray, startDate, endDate, filial, consultor) => {
 const barchartCountsCateg = {};
 const barchartCountsObs = {};
 const filteredData = dataArray.filter(item => {
  return item.data >= startDate && item.data <= endDate && item.filial === filial && item.consultor === consultor;
 });


 filteredData.forEach(item => {
  const category = item.categoria;
  if (barchartCountsCateg[category]) {
   barchartCountsCateg[category]++;
  } else {
   barchartCountsCateg[category] = 1;
  }
  const obs = item.obs;
  if (barchartCountsObs[obs]) {
   barchartCountsObs[obs]++;
  } else {
   barchartCountsObs[obs] = 1;
  }
 });

 return {
  barchartCountsObs,
  barchartCountsCateg
 }



};

module.exports = {
 barChartFilter,
};