const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite');

async function openDB() {
  return sqlite.open({
    filename: './pizza.db',
    driver: sqlite3.Database,
  });
}

router.post('/register', async (req, res) => {

  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const passwordRepeat = req.body.passwordRepeat

  const db = await openDB();
  let succeedFlag = true;
  let errorMsg = [];

  for (dataType of ['username', 'email']) {
    const selectQuery = `SELECT * FROM customers WHERE ${dataType} = $1`;
    let data = await db.all(selectQuery, req.body[dataType]);
    if (data.length > 0) {
      errorMsg.push(`That ${dataType} is already taken`);
      succeedFlag = false;
    }
  }

  //Check matched password
  if (password !== passwordRepeat) {
    errorMsg.push('Password confirmation not matched');
    succeedFlag = false;
  }

  if (!errorMsg.length) {
    const insertQuery =
      'INSERT INTO customers (name, username, email, password) VALUES ($1, $2, $3, $4)';
    const passwordHash = await bcrypt.hash(password, 10);
    results = db.all(insertQuery, [
      name,
      username,
      email,
      passwordHash,
    ]);
  }
  res.status(200).send({
    msg: errorMsg,
    succeed: succeedFlag,
  })
});

router.post('/login', async (req, res) => {
  let errorMsg = [];
  const db = await openDB();

  const selectQuery = 'SELECT * FROM customers WHERE username = $1';
  let data = await db.all(selectQuery, [req.body.username]);

  if (req.session.authenticated) {
    res.send({msg: errorMsg,
      succeed: true,
      session: req.session});
    return;
  }
  if (data.length === 1) {
    const auth = await bcrypt.compare(req.body.password, data[0].password);

    if (auth) {
      req.session.authenticated=true;
      req.session.user = data[0];
      req.session.cart = [];
      req.session.cartCount = 0;
      // console.log(req.session);
      
      req.session.save()
      res.status(200).send({
        msg: "Login Succeed",
        succeed: true,
        session: req.session,
      })
    } else {
      errorMsg.push('Incorrect username/password');
      res.status(200).send({
        msg: errorMsg,
        succeed: false,
      })
    }
  } else {
    errorMsg.push('Incorrect username/password');
    res.status(200).send({
      msg: errorMsg,
      succeed: false,
    })
  }
});


router.get('/change-password', (req, res) => {
  res.render('change-password', { title: 'Change Password', user: req.user });
});


router.post('/change-password', async(req, res) => {
  const db = await openDB();
  const { currentPassword, newPassword, confirmPassword } = req.body;
  if (!bcrypt.compareSync(currentPassword, req.session.user.password)) {
    res.render('change-password', { title: 'Change Password', error: 'Current password is incorrect.'});
    return;
  }
  
  // Check if new password and confirmation match
  if (newPassword !== confirmPassword) {
    res.render('change-password', {  title: 'Change Password', error: 'New password and confirmation do not match.'});
    return;
  }

// Hash the new password and update the user's password
// Hash the new password
const hashedPassword = bcrypt.hashSync(newPassword, 10);
// console.log("finish hashing");
// Update the user's password in the database
const updateQuery = 'UPDATE customers SET password = ? WHERE id = ?';
try {
  await db.run(updateQuery, [hashedPassword, req.session.user.id]);
  res.render('index', { title: 'Express', user: req.session.user , success: 'Password Successfully Changed'});
} catch (err) {
  console.error(err.message);
  res.status(500).send('An error occurred while updating your password.');
}
});


router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

router.get('/auth-info', (req, res) => {
  if (req.session.authenticated)
    res.status(200).send({
      authenticated: req.session.authenticated,
      user: req.session.user
    })
  else
    res.status(200).send({
      authenticated: req.session.authenticated
    })
})

router.get('/cart-info', (req, res) => {
  res.status(200).send({
    cart: req.session.cart,
    cartCount: req.session.cartCount,
  })
})

module.exports = router;