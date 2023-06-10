import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import NavBar from "./NavBar";
// import UserContext from "./UserContext";
import { useNavigate } from "react-router-dom";

function Item(props) {
  // const {updateCart, cart} = useContext(UserContext);
  const navigate = useNavigate();

  async function updateCartWithAPI() {
    const response = await axios({
      url: "http://localhost:3000/api/cart",
      method: "post",
      data: {
        product_id: props.item.id,
      },
      withCredentials: true,
    })
    console.log(response);

    if (response.status === 200) {
      if (!response.data.succeed) {
        navigate('/users/login');
        return;
      } else {
        alert(response.data.msg);
        // updateCart(response.data.session.cart, response.data.session.cartCount);
        props.toggleRenderTrigger();
      }
    }
  }
  return (
    <div className="item">
      <img
        src={props.item.image}
        className="card-img-top"
        alt={props.item.name}
        height="300vw"
        width="200vw"
      />
      <div className="card-body">
        <h5 className="card-title">{props.item.name}</h5>
        <p className="card-text">{props.item.description}</p>
        <button className="btn btn-primary" onClick={() => updateCartWithAPI()}>Add to Cart</button>
      </div>
    </div>
  );
}

function CustomItem(props) {
  const [toppings, setToppings] = useState([]);
  // const {updateCart, cart} = useContext(UserContext);
  const navigate = useNavigate();

  const allToppings = [
    "Pepperoni",
    "Sausage",
    "Jalepenos",
    "Mushrooms",
    "Chicken",
    "Bacon",
    "Black Olives",
    "Onions",
  ];
  const handleToppingChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setToppings([...toppings, parseInt(value)]);
    } else {
      setToppings(toppings.filter((topping) => topping !== parseInt(value)));
    }
  };

  async function updateCartWithAPI() {
    const response = await axios({
      url: "http://localhost:3000/api/cart",
      method: "post",
      data: {
        product_id: 1,
        customizations: toppings,
      },
      withCredentials: true,
    })

    if (response.status === 200) {
      if (!response.data.succeed) {
        navigate('/users/login');
        return;
      } else {
        alert(response.data.msg);
        props.toggleRenderTrigger();
      }
    }
  }
  useEffect(() => {
    console.log(toppings);
  }, [toppings])
  return (
    <div className="custom-item">
      <div className="card-body">
        <h5 className="card-title">Build your own!</h5>
        <form>
          {allToppings.map((topping, idx) => (
            <div key={topping}>
              <input
                type="checkbox"
                id={topping}
                name={topping}
                value={idx+1}
                checked={toppings.includes(idx+1)}
                onChange={handleToppingChange}
              />
              <label htmlFor={topping}>{topping}</label>
            </div>
          ))}
        </form>
        <button className="btn btn-primary" onClick={() => updateCartWithAPI()}>Add to Cart</button>
      </div>
    </div>
  );
}

function Order() {
  const [menu, setMenu] = useState({});
  const categoryList = ["pizza", "sides", "salad"];
  const [renderTrigger, setRenderTrigger] = useState(false);

  async function getMenuFromAPI() {
    for (let category of categoryList) {
      let response = await axios({
        method: "get",
        url: `http://localhost:3000/products/${category}`,
      });
      setMenu((prevMenu) => {
        return {
          ...prevMenu,
          [category]: response.data,
        };
      });
    }
  }
  useEffect(() => {
    getMenuFromAPI();
  }, []);


  function toggleRenderTrigger() {
    setRenderTrigger((prevRenderTrigger) => {
      return !prevRenderTrigger;
    });
  }

  return (
    <div className="order-page">
      <NavBar renderTrigger={renderTrigger}/>
      <div className="main-component">
      {categoryList.map((category, index) => {
        if (menu[category]) {
          return (
            <div className="row" key={category}>
              <section className="container content-section">
                <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
                <div className="row">
                  {menu[category].map((item, itemIndex) => {
                    if (index === 0 && itemIndex === 2) {
                      return (
                        <div className="col-sm-4 shop-item" key="custom">
                          <CustomItem toggleRenderTrigger={toggleRenderTrigger}/>
                        </div>
                      );
                    } else {
                      return (
                        <div className="col-sm-4 shop-item" key={item.id}>
                          <Item item={item} toggleRenderTrigger={toggleRenderTrigger}/>
                        </div>
                      );
                    }
                  })}
                </div>
              </section>
            </div>
          );
        } else return null;
      })}
      </div>
    </div>
  );
}

export default Order;