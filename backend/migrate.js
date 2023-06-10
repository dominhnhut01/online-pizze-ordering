const sqlite3 = require('sqlite3').verbose();

// Create DB

const db = new sqlite3.Database('./pizza.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

db.serialize(() => {
  db.run('DROP TABLE IF EXISTS customers');
  db.run('DROP TABLE IF EXISTS products');
  db.run('DROP TABLE IF EXISTS customizations');
  db.run('DROP TABLE IF EXISTS orders');
  db.run('DROP TABLE IF EXISTS order_lines');
  db.run('DROP TABLE IF EXISTS order_line_customizations');

  db.run(
    'CREATE TABLE customers (id integer PRIMARY KEY AUTOINCREMENT, name text, username text UNIQUE, email text UNIQUE, password text)'
  );
  db.run(
    'CREATE TABLE products (id integer PRIMARY KEY AUTOINCREMENT,name text,description text,category text,image text)'
  );
  db.run(
    'CREATE TABLE customizations (id integer PRIMARY KEY AUTOINCREMENT,name text,category text)'
  );
  db.run(
    'CREATE TABLE orders (id integer PRIMARY KEY AUTOINCREMENT,customer_id integer REFERENCES customers (id),created_at timestamp)'
  );
  db.run(
    'CREATE TABLE order_lines (id integer PRIMARY KEY AUTOINCREMENT,order_id integer REFERENCES orders (id),product_id integer REFERENCES products(id),quantity integer)'
  );
  db.run(
    'CREATE TABLE order_line_customizations (id integer PRIMARY KEY AUTOINCREMENT,order_line_id integer REFERENCES order_lines (id),customization_id integer REFERENCES customizations (id))'
  );

  db.run(
    "INSERT INTO customers (name, username, email, password) VALUES ('RedHawk', 'swoop', 'swoop@example.com', '$2a$12$blNcpxQdZQctW0WgwyQ/4eEjfaSZinATgeecumTeDBYRXbx1ifEEG')"
  );
  db.run(
    "INSERT INTO products (name, description, category, image) VALUES ('Build Your Own!', 'Build your own pizza!', 'BYO', 'https://www.100daysofrealfood.com/wp-content/uploads/2018/02/pizza-toppings2.jpg')"
  );
  db.run(
    "INSERT INTO products (name, description, category, image) VALUES ('Veggie Lovers', 'Run it through the garden!', 'pizza', 'https://www.tasteofhome.com/wp-content/uploads/2018/01/Grilled-Veggie-Pizza_EXPS_LSBZ18_48960_D01_18_6b-6.jpg')"
  );

  db.run(
    "INSERT INTO products (name, description, category, image) VALUES ('Pepperoni Pizza', 'So good', 'pizza', 'https://www.dogtownpizza.com/wp-content/uploads/2020/01/picking-slice-of-pepperoni-pizza-picture-id1133727757.jpg')"
  );
  db.run(
    "INSERT INTO products (name, description, category, image) VALUES ('Pepperoni Pizza', 'So good', 'pizza', 'https://www.dogtownpizza.com/wp-content/uploads/2020/01/picking-slice-of-pepperoni-pizza-picture-id1133727757.jpg')"
  );

  db.run(
    "INSERT INTO products (name, description, category, image) VALUES ('Sad Salad', 'Good', 'salad', 'https://media.phillyvoice.com/media/images/salad_unsplash.2e16d0ba.fill-735x490.jpg')"
  );

  db.run(
    "INSERT INTO products (name, description, category, image) VALUES ('Happy Salad', 'Better', 'salad', 'https://cdn.loveandlemons.com/wp-content/uploads/2021/04/green-salad-500x375.jpg')"
  );

  db.run(
    "INSERT INTO products (name, description, category, image) VALUES ('Debug Salad', 'Well', 'salad', 'https://www.foodandwine.com/thmb/q9tccMZgV9aifYtmlvh9qcPmb_8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Greek-Salad-Romaine-FT-RECIPE1222-8a49c63ede714dfb8fdc0c35088fcd18.jpg')"
  );

  db.run(
    "INSERT INTO products (name, description, category, image) VALUES ('Breadsticks', 'Garlic breadsticks and dipping sauce.', 'sides', 'https://images-gmi-pmc.edge-generalmills.com/a3294838-1549-4904-9183-47821ae3bf4e.jpg')"
  );

  db.run(
    "INSERT INTO products (name, description, category, image) VALUES ('Pizza fingers', 'Pizza in a different way', 'sides', 'https://lovebakerstreet.com/app/uploads/2023/01/BS-Hot-Dog-Roll-Pizzas_01.jpg')"
  );

  db.run(
    "INSERT INTO products (name, description, category, image) VALUES ('Cheese sticks', 'Cheesy', 'sides', 'https://princesspinkygirl.com/wp-content/uploads/2022/07/cheese-sticks-45SQ1200.jpg')"
  );


  db.run(
    "INSERT INTO customizations (name, category) VALUES ('Pepperoni', 'Meat Topping')"
  );
  db.run(
    "INSERT INTO customizations (name, category) VALUES ('Sausage', 'Meat Topping')"
  );
  db.run(
    "INSERT INTO customizations (name, category) VALUES ('Jalepenos', 'Veggie Topping')"
  );
  db.run(
    "INSERT INTO customizations (name, category) VALUES ('Mushrooms', 'Veggie Topping')"
  );

  db.run(
    "INSERT INTO customizations (name, category) VALUES ('Chicken', 'Meat Topping')"
  );

  db.run(
    "INSERT INTO customizations (name, category) VALUES ('Bacon', 'Meat Topping')"
  );
  db.run(
    "INSERT INTO customizations (name, category) VALUES ('Black Olives', 'Veggie Topping')"
  );
  db.run(
    "INSERT INTO customizations (name, category) VALUES ('Onions', 'Veggie Topping')"
  );

  db.run(
    "INSERT INTO orders (customer_id, created_at) VALUES (1, '2019-04-07 14:51:08.131249')"
  );
  db.run(
    "INSERT INTO orders (customer_id, created_at) VALUES (1, '2019-04-07 14:51:14.740154')"
  );

  db.run(
    'INSERT INTO order_lines (order_id, product_id, quantity) VALUES (1, 2, 1)'
  );
  db.run(
    'INSERT INTO order_lines (order_id, product_id, quantity) VALUES (2, 1, 1)'
  );
  db.run(
    'INSERT INTO order_lines (order_id, product_id, quantity) VALUES (2, 3, 2)'
  );

  db.run(
    'INSERT INTO order_line_customizations (order_line_id, customization_id) VALUES (2, 1)'
  );
  db.run(
    'INSERT INTO order_line_customizations (order_line_id, customization_id) VALUES (2, 2)'
  );
});