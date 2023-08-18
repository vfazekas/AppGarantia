function getFilial(filial) {

 if (filial === 'RECIFE') {
  return "A"
 } else if (filial === 'OLINDA') {
  return "B"
 } else if (filial === 'PIEDADE') {
  return "C"
 } else if (filial === 'JOÃO PESSOA') {
  return "D"
 } else if (filial === 'RETIRO') {
  return "E"
 } else if (filial === 'FEIRA DE SANTANA') {
  return "F"
 } else if (filial === 'HOLANDESES') {
  return "G"
 } else if (filial === 'MANAUS') {
  return "H"
 } else if (filial === 'BEQUIMÃO') {
  return "I"
 } else return

}

module.exports = {
 getFilial,
};