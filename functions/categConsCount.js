const countConsCateg = (dataArray, filial) => {
  const categoryCounts = {};
  const consultorCounts = {};

  const filteredData = dataArray.filter(item => item.filial === filial);

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
    categoryCounts,
    consultorCounts
  }
};

module.exports = {
  countConsCateg,
};