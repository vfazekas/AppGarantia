function getCategoria(categoria) {

 if (categoria === 'DOCUMENTAÇÃO') {
  return "B"
 } else if (categoria === 'ORDEM DE SERVIÇO') {
  return "C"
 } else if (categoria === 'FICHA DE GERENCIAMENTO') {
  return "D"
 } else if (categoria === 'SG') {
  return "E"
 } else if (categoria === 'NOTA FISCAL') {
  return "F"
 } else if (categoria === 'CHECK-LIST') {
  return "G"
 } else if (categoria === 'CAMPANHA OU RECALL') {
  return "H"
 } else return

}

module.exports = {
 getCategoria,
};