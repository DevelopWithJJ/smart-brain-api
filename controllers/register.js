//Separating our register endpoints

const handleRegister = (db, bcrypt) => (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json("incorrect form submission"); // Have a return here so the function stops
  }
  const hash = bcrypt.hashSync(password);
  // If one request from one database fails the other fails as well
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit) // Adds our changes to the db
      .catch(trx.rollback); // If anything fails we stop changes;
  }).catch((err) => res.status(400).json("unable to register"));
};

module.exports = {
  handleRegister: handleRegister,
};
