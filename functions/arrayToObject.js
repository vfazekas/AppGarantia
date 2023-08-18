function transformArrayToObjects(inputArray) {
 const keys = ['name', 'login', 'password', 'role', 'filial'];

 const result = inputArray.map((innerArray, index) => {
  const obj = { index: index + 1 };
  keys.forEach((key, i) => {
   obj[key] = innerArray[i];
  });
  return obj;
 });

 return result;
}

module.exports = {
 transformArrayToObjects,
};