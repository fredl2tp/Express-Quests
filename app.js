require("dotenv").config();
const express = require("express");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");
const {
  hashPassword,
  verifyPassword,
  verifyToken,
  verifyId,
} = require("./auth.js");

//------GET-------
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);
//------REGISTER-------
app.post("/api/users", hashPassword, userHandlers.postUser);
app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

app.use(verifyToken); // authentication wall : verifyToken is activated for each route after this line
//------POST, PUT et DELETE-------
app.post("/api/movies", movieHandlers.postMovie);

app.put("/api/movies/:id", movieHandlers.putMovieById);
app.put("/api/users/:id", verifyId, hashPassword, userHandlers.putUserById);

app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.delete("/api/users/:id", verifyId, userHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
