const express = require("express");
const session = require('express-session');
const { google } = require("googleapis");
require('dotenv').config();
const userUtils = require('./functions/userUtils');
const { getGoogleSheetsClient } = require('./functions/googleSheetsUtils');
const pegaFilial = require('./functions/getFilial');
const pegaCategoria = require('./functions/getCategoria');
const arrayToObject = require('./functions/arrayToObject');
const dbTrabsformm = require('./functions/dbTransform');
const categConsultCount = require('./functions/categConsCount');
const filterdashConsultor = require('./functions/filterdash');
const filterBarChartData = require('./functions/barChartFilter');

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var root = require('path').join(__dirname, '/src/img');
app.use(express.static(root));

// Configure session middleware
app.use(session({
 secret: 'mysecret',
 resave: false,
 saveUninitialized: false
}));

// Authentication middleware
function authenticate(req, res, next) {
 if (req.session.authenticated) {
  return next();
 }

 // User is not authenticated, redirect to the login page
 res.redirect('/');
}

app.get("/", (req, res) => {
 res.render("login", { message: '' })
});

app.post('/', async (req, res) => {
 const enteredUsername = req.body.username;
 const enteredPassword = req.body.password;

 try {
  const googleSheets = await getGoogleSheetsClient();

  const spreadsheetId = "1dXWwsAubmD1EhaleUdqot91uizVTOg9CveT47_o5vx0";

  // Read rows from spreadsheet
  const getUsuarios = await googleSheets.spreadsheets.values.get({
   spreadsheetId,
   range: "Users!A2:E",
  });
  const usuarios = getUsuarios.data.values;
  // Use the findUser function from userUtils.js
  const result = userUtils.findUser(usuarios, enteredUsername, enteredPassword);
  req.session.authenticated = true;


  // Check if the user is found
  if (typeof result === 'string') {
   // User not found, redirect to the login page with a message
   res.redirect('/?msg=User not found');
  } else {
   // User found, redirect to the menu page with the user information
   req.session.authenticated = true;
   req.session.user = result; // Store the 'result' object in the 'user' session variable
   res.redirect('/menu');
  }

 } catch (error) {
  console.error("Error occurred:", error);
  res.status(500).json({ error: "Internal Server Error" });
 }
});

app.get("/menu", authenticate, (req, res) => {
 const user = req.session.user;
 res.render("menu", { info: user })
});


app.get("/consultor", authenticate, async (req, res) => {
 const user = req.session.user;
 const googleSheets = await getGoogleSheetsClient();
 const spreadsheetId = "1dXWwsAubmD1EhaleUdqot91uizVTOg9CveT47_o5vx0";
 const column = pegaFilial.getFilial(user.Filial);

 // Read Consultores
 const getConsultor = await googleSheets.spreadsheets.values.get({
  spreadsheetId,
  range: `Consultor!${column}2:${column}`,
 });
 const consultor = getConsultor.data.values;

 // Read Categoria
 const getCategoria = await googleSheets.spreadsheets.values.get({
  spreadsheetId,
  range: `CATEGORIA!A2:A`,
 });
 const categoria = getCategoria.data.values;

 res.render("consultor", { info: user, consult: consultor, categ: categoria, msg: req.query.msg })
});

app.post('/search', async (req, res) => {
 const selectedValue = req.body.selectedValue;
 const categoria = pegaCategoria.getCategoria(selectedValue);
 const googleSheets = await getGoogleSheetsClient();
 const spreadsheetId = "1dXWwsAubmD1EhaleUdqot91uizVTOg9CveT47_o5vx0";

 // Read Consultores
 const getCategoria = await googleSheets.spreadsheets.values.get({
  spreadsheetId,
  range: `CATEGORIA!${categoria}2:${categoria}`,
 });
 const response = getCategoria.data.values;


 res.json(response);
});

app.post('/consultor', async (req, res) => {
 const googleSheets = await getGoogleSheetsClient();
 const spreadsheetId = "1dXWwsAubmD1EhaleUdqot91uizVTOg9CveT47_o5vx0";
 const os = req.body.Os;
 const data = req.body.data;
 const consultor = req.body.Consultor;
 const categoria = req.body.categoria;
 const erro = req.body.erro;
 const filial = req.session.user.Filial;


 // Write row(s) to spreadsheet
 await googleSheets.spreadsheets.values.append({
  spreadsheetId,
  range: 'DBConsultor!A2:F',
  valueInputOption: "USER_ENTERED",
  resource: {
   values: [[data, os, consultor, categoria, erro, filial]],
  },
 });
 res.redirect("/consultor?msg=item enviado com sucesso!!");

});

app.get('/tecnico', authenticate, async (req, res) => {
 const user = req.session.user;
 const googleSheets = await getGoogleSheetsClient();
 const spreadsheetId = "1dXWwsAubmD1EhaleUdqot91uizVTOg9CveT47_o5vx0";
 const column = pegaFilial.getFilial(user.Filial);

 // Read Consultores
 const getTecnico = await googleSheets.spreadsheets.values.get({
  spreadsheetId,
  range: `Técnico!${column}2:${column}`,
 });
 const tecnico = getTecnico.data.values;

 res.render("tecnico", { info: user, tecnico, msg: req.query.msg })

});


app.post('/tecnico', async (req, res) => {
 const googleSheets = await getGoogleSheetsClient();
 const spreadsheetId = "1dXWwsAubmD1EhaleUdqot91uizVTOg9CveT47_o5vx0";
 const os = req.body.Os;
 const data = req.body.data;
 const filial = req.session.user.Filial;
 const tecnico = req.body.tecnico;
 const descrição = req.body.description;

 // Write row(s) to spreadsheet
 await googleSheets.spreadsheets.values.append({
  spreadsheetId,
  range: 'DBTecnico!A2:E',
  valueInputOption: "USER_ENTERED",
  resource: {
   values: [[data, os, tecnico, descrição, filial]],
  },
 });
 res.redirect("/tecnico?msg=item enviado com sucesso!!");


});


app.get('/adduser', authenticate, async (req, res) => {
 const googleSheets = await getGoogleSheetsClient();
 const spreadsheetId = "1dXWwsAubmD1EhaleUdqot91uizVTOg9CveT47_o5vx0";
 const user = req.session.user

 // Read users
 const getUsers = await googleSheets.spreadsheets.values.get({
  spreadsheetId,
  range: `Users!A2:E`,
 });
 const users = getUsers.data.values;

 const object = arrayToObject.transformArrayToObjects(users)


 res.render('create_user', { object, info: user })
});


app.post('/updateuser', async (req, res) => {
 const googleSheets = await getGoogleSheetsClient();
 const spreadsheetId = "1dXWwsAubmD1EhaleUdqot91uizVTOg9CveT47_o5vx0";
 const updatedUser = req.body;
 const response = await googleSheets.spreadsheets.values.update({
  spreadsheetId,
  range: `Users!A${updatedUser.index}:E${updatedUser.index}`,
  valueInputOption: "RAW",
  resource: {
   values: [updatedUser.values],
  },
 });
 res.status(200).json({ message: 'User data updated successfully' });

});

app.delete('/deleteuser/:userId', async (req, res) => {
 const googleSheets = await getGoogleSheetsClient();
 const spreadsheetId = "1dXWwsAubmD1EhaleUdqot91uizVTOg9CveT47_o5vx0";
 try {
  const userId = req.params.userId;
  const range = `Users!A${userId}:E${userId}`;

  await googleSheets.spreadsheets.values.clear({
   spreadsheetId,
   range,
  });

  res.status(204).send(); // Send a success response without content
 } catch (error) {
  console.error('Error deleting user:', error);
  res.status(500).send('An error occurred while deleting user');
 }
});

app.post('/addeduser', async (req, res) => {
 const googleSheets = await getGoogleSheetsClient();
 const spreadsheetId = "1dXWwsAubmD1EhaleUdqot91uizVTOg9CveT47_o5vx0";
 const user = req.body;

 // Write row(s) to spreadsheet
 await googleSheets.spreadsheets.values.append({
  spreadsheetId,
  range: 'Users!A2:E',
  valueInputOption: "USER_ENTERED",
  resource: {
   values: [user.values],
  },
 });

 res.status(200).json({ message: 'User data added successfully' });


});

app.get('/dashboard', authenticate, async (req, res) => {
 const googleSheets = await getGoogleSheetsClient();
 const spreadsheetId = "1dXWwsAubmD1EhaleUdqot91uizVTOg9CveT47_o5vx0";
 const user = req.session.user

 // Read DB
 const getDb = await googleSheets.spreadsheets.values.get({
  spreadsheetId,
  range: `DBConsultor!A2:F`,
 });
 const DB = getDb.data.values;

 const transformObject = dbTrabsformm.transformArrayToObject(DB);
 const consultCateg = categConsultCount.countConsCateg(transformObject, user.Filial);
 const consultCategStringfy = JSON.stringify(consultCateg);

 res.render('dashBoard', { consultCategStringfy, user })

});


app.get('/filterdash/data', async (req, res) => {
 const { filial, startDate, endDate } = req.query;
 const googleSheets = await getGoogleSheetsClient();
 const spreadsheetId = "1dXWwsAubmD1EhaleUdqot91uizVTOg9CveT47_o5vx0";
 // Read DB
 const getDb = await googleSheets.spreadsheets.values.get({
  spreadsheetId,
  range: `DBConsultor!A2:F`,
 });
 const DB = getDb.data.values;

 const transformObject = dbTrabsformm.transformArrayToObject(DB);

 const responseData = filterdashConsultor.filterAndCountConsultantsAndCategories(transformObject, startDate, endDate, filial)

 res.json(responseData);
});

app.get('/getBarChartData', async (req, res) => {
 const { filial, startDate, endDate, consultor } = req.query;
 const googleSheets = await getGoogleSheetsClient();
 const spreadsheetId = "1dXWwsAubmD1EhaleUdqot91uizVTOg9CveT47_o5vx0";
 // Read DB
 const getDb = await googleSheets.spreadsheets.values.get({
  spreadsheetId,
  range: `DBConsultor!A2:F`,
 });
 const DB = getDb.data.values;

 const transformObject = dbTrabsformm.transformArrayToObject(DB);

 const filteredData = filterBarChartData.barChartFilter(transformObject, startDate, endDate, filial, consultor);


 res.json(filteredData);

});



const PORT = 3000;

app.listen(PORT, (req, res) => console.log(`http://localhost:${PORT}`))