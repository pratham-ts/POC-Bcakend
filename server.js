require("dotenv/config");
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const sql = require("mssql");
const config = require("./dbconfig");
const jwt = require("jsonwebtoken");
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/ping", (req, res) => {
  res.send("server is running", process.env.APP_PORT_NUMBER);
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const pool = await sql.connect(config);
  const result = (
    await pool.query`SELECT * from tblUsers tu WHERE tu.Email = ${email}`
  ).recordset[0];
  if (!result) res.send({ error: "User not valid" });
  if (await bcrypt.compare(password, result.PasswordHash)) {
    const token = jwt.sign(
      { userId: result.UserID, email: result.Email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2h" }
    );

    res.send({ token });
  } else {
    res.send({ error: "Invalid Credentials" });
  }
});
app.get("/project/:userId", async (req, res) => {
  const { userId } = req.params;
  const pool = await sql.connect(config);
  const result = (
    await pool.query`SELECT * from tblProject tp WHERE tp.ProjectCreatedUserID = ${userId}`
  ).recordsets[0];
  res.send(result);
});
const pool = sql.connect(config).then(() => {
  app.listen(process.env.APP_PORT_NUMBER, "0.0.0.0", () => {
    console.log(`Listening on port ${process.env.APP_PORT_NUMBER}...`);
  });
});
