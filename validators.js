const validateMovie = (req, res, next) => {
  // validate req.body then call next() if everything is ok
  const { title, director, year, color, duration } = req.body;
  const errors = [];

  if (!title.length) {
    errors.push({ field: "title", message: "This field is required" });
  } else if (title.length >= 255) {
    errors.push({
      field: "title",
      message: "Should contain less than 255 characters",
    });
  }
  if (!director.length) {
    errors.push({ field: "director", message: "This field is required" });
  }
  if (!year.length) {
    errors.push({ field: "year", message: "This field is required" });
  }
  if (!color.length) {
    errors.push({ field: "color", message: "This field is required" });
  }
  if (!duration.length) {
    errors.push({ field: "duration", message: "This field is required" });
  }

  if (errors.length) {
    res.status(422).json({ validationErrors: errors });
  } else {
    next();
  }
};
const validateUser = (req, res, next) => {
  const { firstname, lastname, email, password, city, language } = req.body;
  console.log(req.body);
  const errors = [];

  const emailRegex = /[a-z0-9._]+@[a-z0-9-]+\.[a-z]{2,3}/;

  if (!firstname.length) {
    errors.push({ field: "firstname", message: "This field is required" });
  } else if (firstname.length >= 60) {
    errors.push({
      field: "firstname",
      message: "Should contain less than 60 characters",
    });
  }
  if (!lastname.length) {
    errors.push({ field: "lastname", message: "This field is required" });
  } else if (lastname.length >= 60) {
    errors.push({
      field: "lastname",
      message: "Should contain less than 60 characters",
    });
  }
  if (!email.length) {
    errors.push({ field: "email", message: "This field is required" });
  } else if (!emailRegex.test(email)) {
    errors.push({ field: "email", message: "Invalid email" });
  } else if (email.length >= 60) {
    errors.push({
      field: "email",
      message: "Should contain less than 255 characters",
    });
  }
  if (password == null) {
    errors.push({ field: "password", message: "This field is required" });
  } else if (password.length >= 255) {
    errors.push({
      field: "password",
      message: "Should contain less than 255 characters",
    });
  }

  if (!city.length) {
    errors.push({ field: "city", message: "This field is required" });
  } else if (city.length >= 60) {
    errors.push({
      field: "city",
      message: "Should contain less than 60 characters",
    });
  }
  if (!language.length) {
    errors.push({ field: "language", message: "This field is required" });
  } else if (language.length >= 60) {
    errors.push({
      field: "language",
      message: "Should contain less than 60 characters",
    });
  }

  if (errors.length) {
    res.status(422).json({ validationErrors: errors });
  } else {
    next();
  }
};

module.exports = {
  validateMovie,
  validateUser,
};
