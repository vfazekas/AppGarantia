function transformArrayToObject(inputArray) {
 return inputArray.map(item => {
  return {
   data: item[0],
   os: item[1],
   consultor: item[2],
   categoria: item[3],
   obs: item[4],
   filial: item[5]
  };
 });
}

module.exports = {
 transformArrayToObject,
};