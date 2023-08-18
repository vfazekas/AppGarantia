function findUser(arrayOfArrays, enteredUsername, enteredPassword) {
 for (const userArray of arrayOfArrays) {
  const [name, username, password, role, filial] = userArray;
  if (username === enteredUsername && password === enteredPassword) {
   return {
    Name: name,
    Username: username,
    Password: password,
    Role: role,
    Filial: filial,
   };
  }
 }

 return "User not found.";
}

module.exports = {
 findUser,
};