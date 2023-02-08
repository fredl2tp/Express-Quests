const database = require("./database");
//Quest 6----------------
const getUsers = (req, res) => {
  const initialSql =
    "select id, firstname, lastname, email, city, language from users";
  const where = [];

  if (req.query.language != null) {
    where.push({
      column: "language",
      value: req.query.language,
      operator: "=",
    });
  }
  if (req.query.city != null) {
    where.push({
      column: "city",
      value: req.query.city,
      operator: "=",
    });
  }

  database
    .query(
      where.reduce(
        (sql, { column, operator }, index) =>
          `${sql} ${index === 0 ? "where" : "and"} ${column} ${operator} ?`,
        initialSql
      ),
      where.map(({ value }) => value)
    )
    .then(([users]) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};
//Quest 2--------------------------------------
// const getUsers = (req, res) => {
//   database
//     .query("select * from users")
//     .then(([users]) => {
//       res.json(users);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send("Error retrieving data from database");
//     });
// };

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query(
      "select id, firstname, lastname, email, city, language from users where id = ?",
      [id]
    )
    .then(([users]) => {
      if (users[0] != null) {
        res.json(users[0]);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};
//firstname,lastname,email,city
const postUser = (req, res) => {
  const { id, firstname, lastname, email, city, language, hashedPassword } =
    req.body;

  database
    .query(
      "INSERT INTO users(id, firstname, lastname, email, city, language, hashedPassword) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, firstname, lastname, email, city, language, hashedPassword]
    )
    .then(([result]) => {
      // wait for it
      //en-tête Location pointant vers la nouvelle ressource et statut HTTP "Created"
      res.location(`/api/users/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the user");
    });
};
//-----------------Quest 8----------------
const getUserByEmailWithPasswordAndPassToNext = (req, res, next) => {
  const { email } = req.body;

  database
    .query("select * from users where email = ?", [email])
    .then(([users]) => {
      if (users[0] != null) {
        req.user = users[0];

        next();
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};
//-----------------Quest 8----------------

const putUserById = (req, res) => {
  // if (req.params.id === req.payload.sub) {
    const id = parseInt(req.params.id);
    const { firstname, lastname, email, city, language, hashedPassword } =
      req.body;

    database
      .query(
        "UPDATE users set firstname = ?, lastname = ?, email = ?, city = ?, language = ?, hashedPassword = ? where id = ?",
        [firstname, lastname, email, city, language, hashedPassword, id]
      )
      .then(([result]) => {
        // wait for it
        if (result.affectedRows === 0) {
          res.status(404).send("Not Found");
        } else {
          res.sendStatus(204);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error saving the user");
      });
};

const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("DELETE from users where id = ?", [id])
    .then(([result]) => {
      // wait for it
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the user");
    });
};

module.exports = {
  getUsers,
  getUserById,
  postUser,
  putUserById,
  deleteUser,
  getUserByEmailWithPasswordAndPassToNext,
};
