const express = require('express');

const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite');

async function openDB() {
  return sqlite.open({
    filename: './pizza.db',
    driver: sqlite3.Database,
  });
}

function arraysAreEqualById(customizations1, customizations2) {
  if (customizations1.length !== customizations2.length) {
    return false;
  }

  const idSet = new Set(customizations1.map((elem) => elem.id));
  for (let i = 0; i < customizations2.length; i++) {
    if (idSet.has(customizations2[i].id)) {
      return true;
    }
  }
  return false;
}

function addDuplicate(data, cart) {
  for (let idx = 0; idx < cart.length; idx++) {
    if (cart[idx].id == data.id) {
      cart[idx].quantity += 1;
      return;
    }
  }
  console.log(cart);
  data = {
    ...data,
    ['list_id']: cart.length !== 0 ? cart[cart.length - 1].list_id + 1 : 1,
  };
  cart.push(data);
}

function addDuplicateCustom(data, cart, new_customizations) {
  for (let idx = 0; idx < cart.length; idx++) {
    if (cart[idx].id === data.id && cart[idx].id === 1) {
      if (arraysAreEqualById(cart[idx].customizations, new_customizations)) {
        cart[idx].quantity += 1;
        return;
      }
    }
  }

  data = {
    ...data,
    ['list_id']: cart.length !== 0 ? cart[cart.length - 1].list_id + 1 : 1,
  };

  cart.push(data);
  cart.at(-1).customizations = new_customizations;
}

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.get('/products/:category', async (req, res) => {
  const db = await openDB();
  const selectQuery = `SELECT * FROM products WHERE category = $1`;
  const data = await db.all(selectQuery, req.params.category);
  res.status(200).send(data);
});

router.post('/api/cart', async (req, res) => {
  if (!req.session.authenticated) {
    res.status(200).send({
      succeed: false,
    });
    return;
  }

  const product_id = req.body.product_id;
  // console.log(product_id)

  const db = await openDB();
  let selectQuery = `SELECT * FROM products WHERE id = $1`;
  let data = await db.all(selectQuery, product_id);
  data = data[0];
  data = {
    ...data,
    ['quantity']: 1,
  };
  // console.log(data)

  let new_customizations_id;
  let new_customizations = [];
  if (product_id === 1) {
    new_customizations_id = req.body.customizations;

    for (let customization_id of new_customizations_id) {
      selectQuery = `SELECT * FROM customizations WHERE id = '${customization_id}'`;
      let customization = await db.all(selectQuery);
      customization = customization[0];
      new_customizations.push(customization);
    }
  }
  if (product_id === 1) {
    await addDuplicateCustom(data, req.session.cart, new_customizations);
  } else {
    await addDuplicate(data, req.session.cart);
  }
  req.session.cartCount += 1;
  req.session.save(() =>
    res.status(200).send({
      msg: 'Added Successfully',
      succeed: true,
      session: req.session,
    })
  );
});

router.put('/api/cart/:id', (req, res) => {
  const deleted = req.body.deleted;
  const newQuantity = deleted ? 0 : parseInt(req.body.newQuantity);

  if (req.session.cart.length > 0) {
    for (let idx = 0; idx < req.session.cart.length; idx++) {
      if (req.session.cart[idx].list_id == req.params.id) {
        req.session.cartCount += newQuantity - req.session.cart[idx].quantity;
        if (newQuantity === 0 || newQuantity === '0') {
          req.session.cart.splice(idx, 1);
        } else {
          req.session.cart[idx].quantity = newQuantity;
        }
        break;
        // req.session.cart[idx].quantity = req.body.newQuantity;
      }
    }
  }
  req.session.save();
  res.status(200).send({
    msg: 'Updated Successfully',
    succeed: true,
    list_id: req.params.id,
    newQuantity: req.body.newQuantity,
  });
});

router.delete('/api/cart', (req, res) => {
  req.session.cart = [];
  req.session.cartCount = 0;
  req.session.save();
  res.status(200).send({
    msg: 'Empty Cart Successfully',
    succeed: true,
  });
});

router.post('/api/submit', async (req, res) => {
  if (!req.session.authenticated) {
    res.status(401).send();
    return;
  }

  try {
    const db = await openDB();

    const uid = req.session.user.id;
    const orderQuery = `INSERT INTO orders (customer_id, created_at) VALUES (${uid}, DATETIME('now')) RETURNING id`;

    const order_id = (await db.run(orderQuery)).lastID;

    for (let product of req.session.cart) {
      const product_id = product.id;
      const quantity = product.quantity;

      const orderLineQuery = `INSERT INTO order_lines (order_id, product_id, quantity) VALUES (${order_id}, ${product_id}, ${quantity}) RETURNING id`;

      const orderLineID = (await db.run(orderLineQuery)).lastID;
      if (product.customizations) {
        const orderCustomizationQuery = `INSERT INTO order_line_customizations (order_line_id, customization_id) VALUES ($1, $2)`;
        for (let customization of product.customizations) {
          db.run(orderCustomizationQuery, [orderLineID, customization.id]);
        }
      }
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send();
    return;
  }
  req.session.cart = [];
  req.session.cartCount = 0;
  req.session.save();
  res.status(200).send({
    msg: 'Submited Order',
    succeed: true,
  });
});

module.exports = router;
