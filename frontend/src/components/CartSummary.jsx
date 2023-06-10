import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function is_numeric(str) {
  return /^\d+$/.test(str);
}
function CartSummary() {
  const [cart, setCart] = useState([]);
  const [quantityList, setQuantityList] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [renderTrigger, setRenderTrigger] = useState(false);
  const navigate = useNavigate();
  function toggleRenderTrigger() {
    setRenderTrigger((prevRenderTrigger) => {
      return !prevRenderTrigger;
    });
  }

  function handleQuantiTyInput(evt) {
    setQuantityList({
      ...quantityList,
      [evt.target.name]: {
        ...quantityList[evt.target.name],
        ["quantity"]: evt.target.value,
      },
    });
  }

  async function updateCartWithAPI(list_id, newValue, deleted) {
    const response = await axios({
      method: "put",
      url: `http://localhost:3000/api/cart/${list_id}`,
      data: {
        deleted: false,
        newQuantity: newValue,
      },
      withCredentials: true,
    });
    if (response.status === 200) {
      if (!response.data.succeed) {
        navigate("/users/login");
        return;
      } else {
        alert(response.data.msg);
        setQuantityList({
          ...quantityList,
          [response.data.list_id]: {
            ...quantityList[response.data.list_id],
            ["quantity"]: response.data.newQuantity,
          },
        });
      }
    }
    toggleRenderTrigger();
  }

  async function emptyCartWithAPI() {
    const response = await axios({
      method: "delete",
      url: `http://localhost:3000/api/cart`,
      withCredentials: true,
    });
    if (response.status === 200) {
      if (!response.data.succeed) {
        navigate("/users/login");
        return;
      } else {
        alert(response.data.msg);
        setQuantityList({});
        setCart([]);
      }
    }
    toggleRenderTrigger();
  }

  function handleEmptyCartButton(evt) {
    emptyCartWithAPI();
  }

  function handleUpdateButton(evt) {
    const list_id = evt.target.name;
    if (!is_numeric(quantityList[list_id].quantity)) {
      alert("Please enter number only");
    } else {
      const newValue = parseInt(quantityList[list_id].quantity);
      updateCartWithAPI(list_id, newValue, false);
    }
  }

  function handleDeleteButton(evt) {
    const list_id = evt.target.name;
    updateCartWithAPI(list_id, 0, true);
  }

  async function fetchCartData() {
    const response = await axios({
      url: "http://localhost:3000/users/cart-info",
      method: "get",
      withCredentials: true,
    });

    const cart = response.data.cart;
    setCart(cart);
    const newQuantityList = {};
    for (let idx = 0; idx < cart.length; idx++) {
      let item = cart[idx];
      let customization_str = "";
      if (item.customizations) {
        for (let customization of item.customizations) {
          customization_str += customization.name + ", ";
        }
        customization_str.substring(0, customization_str.length - 1);
      }
      newQuantityList[item.list_id] = {
        list_id: item.list_id,
        quantity: item.quantity,
        customizations: customization_str,
      };
    }
    setQuantityList(newQuantityList);
    setIsLoading(false);
  }

  async function submitOrder() {
    const response = await axios({
      url: "http://localhost:3000/api/submit",
      method: "post",
      withCredentials: true,
    });

    if (response.status == 401) {
      navigate("/users/login");
      return;
    }
    if (response.status == 200) {
      navigate("/users/submited-order");
      return;
    }
  }

  useEffect(() => {
    fetchCartData();
  }, [renderTrigger]);

  useEffect(() => {
    console.log("quanList");
    console.log(quantityList);
    console.log(cart);
  }, [quantityList]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="cart-summary-page">
      <NavBar renderTrigger={renderTrigger} />
      <div className="main-component">
        <br />
        <h1>Your Cart</h1>
        <button
          type="button"
          className="btn btn-danger"
          onClick={handleEmptyCartButton}
        >
          Empty Cart
        </button>
        <div className="item-listing">
          {cart.length != 0 && quantityList ? (
            cart.map((item, idx) => {
              return (
                <div className="row my-2 item-row" key={idx}>
                  <div className="col-5">
                    <h5>{item.name}</h5>
                    <p>{quantityList[item.list_id].customizations}</p>
                  </div>
                  <div className="col-2">
                    <input
                      type="text"
                      className="form-control"
                      id={"input" + idx}
                      value={quantityList[item.list_id].quantity}
                      name={item.list_id}
                      onChange={handleQuantiTyInput}
                    />
                  </div>
                  <div className="col-2">
                    <div className="row">
                      <button
                        type="button"
                        className="btn btn-primary mx-2 col-6"
                        name={item.list_id}
                        onClick={handleUpdateButton}
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger mx-2 col-6"
                        name={item.list_id}
                        onClick={handleDeleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <h3 className="my-4 mx-2">You have no item in cart</h3>
          )}
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => submitOrder()}
        >
          Submit Order
        </button>
      </div>
    </div>
  );
}

export default CartSummary;
