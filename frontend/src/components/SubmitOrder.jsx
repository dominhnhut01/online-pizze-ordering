import NavBar from "./NavBar";

function SubmitOrder() {
  return (
    <div className="submit-order">
      <NavBar renderTrigger={() => {}} />
      <h1 className="mx-3 my-5">Submitted Order!</h1>
    </div>
  );
}

export default SubmitOrder;
