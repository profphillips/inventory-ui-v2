// This React app is the user interface for maintaining a simple inventory
// list. The design goal was to put all of the functions in a single file
// to help study how they work.

// Mongodb/Atlas storage is accessed via an api running on a Heroku server.
// Both Atlas and Heroku are free accounts.

// by John Phillips on 2021-02-24 revised 2021-02-25
// v2 on 2021-03-19 revised 2021-04-02

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
// import { useRoutes, A } from "hookrouter";
import { BrowserRouter as Router, Switch, Route, Link, NavLink } from "react-router-dom";
import axios from "axios";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    {/* <App /> */}
    <NavBar />
  </React.StrictMode>,
  document.getElementById("root")
);

// Routing
export default function NavBar() {
return (
    <Router>
      {/* <div > */}
        <ul className="navbar">
          <li className="nav-item">
            <NavLink exact className="nav-link" activeClassName="nav-active" to="/">
              Shop
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className="nav-link" activeClassName="nav-active" to="/print">
              Print
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" activeClassName="nav-active" to="/about">
              About
            </NavLink>
          </li>
        </ul>

        {/* <hr /> */}

        <Switch>
          <Route exact path="/">
            <App />
          </Route>
          <Route path="/about">
            <Footer />
          </Route>
          <Route path="/print">
            <div>
            <h1>Print</h1>
            </div>
          </Route>
        </Switch>
      {/* </div> */}
    </Router>
  );
}

//
// ***** Main function *******************************************************
function App() {
  // Create a React state array and a function to change the data.
  // dataArray contains all of our inventory data organized by row.
  let [dataArray, setDataArray] = useState([]);

  // On startup, retrieve inventory data from the db and place in our array.
  useEffect(() => {
    dbGetAllData(setDataArray);
  }, []); // ignore warning - empty dependency array [] so only executed once

  // Any time dataArray changes then this hook will automatically be called.
  // Uncomment the following to console view the dataArray as it is updated.
  useEffect(() => {
    console.log("second useEffect runs whenever the dataArray changes");
    console.log(dataArray);
  }, [dataArray]);

  // Add a new row to db and get new id back; then add to array.
  async function addNewRow(buy, fav, qty, itemName) {
    const newId = await dbAddNewRow(buy, fav, qty, itemName);
    const newRow = { _id: newId, buy: buy, fav: fav, qty: qty, name: itemName };
    setDataArray([...dataArray, newRow]);
  }

  // When the buy checkbox is clicked update the array and then the db.
  function updateRowBuy(row2update, buy) {
    const updatedRow = {
      _id: row2update._id,
      buy: buy,
      fav: row2update.fav,
      qty: row2update.qty,
      name: row2update.name,
    };
    // check each row for the matching id and if found return the updated row
    const updatedItems = dataArray.map((row) => {
      if (row._id === row2update._id) {
        return updatedRow;
      }
      return row;
    });
    setDataArray(updatedItems);
    dbUpdateRow(updatedRow);
  }

  // When the fav checkbox is clicked update the array and then the db.
  function updateRowFav(row2update, fav) {
    const updatedRow = {
      _id: row2update._id,
      buy: row2update.buy,
      fav: fav,
      qty: row2update.qty,
      name: row2update.name,
    };
    const updatedItems = dataArray.map((row) => {
      if (row._id === row2update._id) {
        return updatedRow;
      }
      return row;
    });
    setDataArray(updatedItems);
    dbUpdateRow(updatedRow);
  }

  // When the qty textbox is changed update the array and then the db.
  function updateRowQty(row2update, qty) {
    const updatedRow = {
      _id: row2update._id,
      buy: row2update.buy,
      fav: row2update.fav,
      qty: qty,
      name: row2update.name,
    };
    const updatedItems = dataArray.map((row) => {
      if (row._id === row2update._id) {
        return updatedRow;
      }
      return row;
    });
    setDataArray(updatedItems);
    dbUpdateRow(updatedRow);
  }

  // When the item name textbox is changed update the array and then the db.
  function updateRowName(row2update, itemName) {
    const updatedRow = {
      _id: row2update._id,
      buy: row2update.buy,
      fav: row2update.fav,
      qty: row2update.qty,
      name: itemName,
    };
    const updatedItems = dataArray.map((row) => {
      if (row._id === row2update._id) {
        return updatedRow;
      }
      return row;
    });
    setDataArray(updatedItems);
    dbUpdateRow(updatedRow);
  }

  // When the delete button is pressed update the array and then the db.
  function removeRow(id2delete) {
    // filter out any row where the ids don't match
    const updatedItems = dataArray.filter((row) => row._id !== id2delete);
    setDataArray(updatedItems);
    dbRemoveRow(id2delete);
  }

  return (
    <div>
      <div className="wrapper">
        {/* <Navbar /> */}
        <ColumnNames />
        <InputForm addNewRow={addNewRow} className="InputForm" />
        {dataArray.map((oneRow) => (
          <ListRow
            key={oneRow._id}
            oneRow={oneRow}
            remove={removeRow}
            updateFav={updateRowFav}
            updateBuy={updateRowBuy}
            updateQty={updateRowQty}
            updateName={updateRowName}
          />
        ))}
        {/* <Footer /> */}
      </div>
    </div>
  );
}
// ***** End Main function ***************************************************

// Display the column names at the top of the grid/table
function ColumnNames() {
  return (
    <div className="column-names-container">
      <div>Buy</div>
      <div>Fav</div>
      <div>Qty</div>
      <div>Item Name</div>
    </div>
  );
}

// Display's empty checkboxes, qty, and item name text fields;
// when submitted this adds a new row of data.
function InputForm({ addNewRow }) {
  const [name, handleItemNameChange, resetItemNameField] = useInputState("");
  const [qty, handleQtyChange, resetQtyField] = useInputState("1");
  const [buy, setBuy] = useState(false);
  const [fav, setFav] = useState(false);

  function handleBuyChange() {
    setBuy(!buy);
  }

  function handleFavChange() {
    setFav(!fav);
  }

  // next 2 lines enable the focus to return to the item name textbox
  // after the 'add' button is clicked
  const textInput = React.createRef();
  const focus = () => textInput.current.focus();

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addNewRow(buy, fav, qty, name);
          resetItemNameField();
          resetQtyField();
          setBuy(false);
          setFav(false);
          focus(); // returns focus to item name textbox after submit
        }}
      >
        <div className="grid-container">
          <div>
            <input
              name="buy"
              type="checkbox"
              onChange={handleBuyChange}
              checked={!!buy} // turn null into false and true stays true
            />
          </div>
          <div>
            <input
              name="fav"
              type="checkbox"
              onChange={handleFavChange}
              checked={!!fav}
            />
          </div>
          <div>
            <input
              className="qty"
              name="qty"
              type="text"
              value={qty}
              placeholder="Qty"
              onChange={handleQtyChange}
            />
          </div>
          <div>
            <input
              className="item-name"
              name="itemName"
              type="text"
              value={name}
              placeholder="New Item"
              onChange={handleItemNameChange}
              autoFocus
              ref={textInput} // returns focus to name textbox after submit
            />
          </div>
          <div>
            <button className="form-button" name="addButton" type="submit">
              Add
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

// Display a single row of editable data with a delete button.
function ListRow({
  oneRow,
  remove,
  updateBuy,
  updateFav,
  updateQty,
  updateName,
}) {
  const [buy, setBuy] = useState(oneRow.buy);
  const [fav, setFav] = useState(oneRow.fav);
  const [qty, handleQtyChange] = useInputState(oneRow.qty);
  const [name, handleNameChange] = useInputState(oneRow.name);

  function handleBuyChange() {
    const newBuy = !buy;
    setBuy(newBuy);
    updateBuy(oneRow, newBuy);
  }

  function handleFavChange() {
    const newFav = !fav;
    setFav(newFav);
    updateFav(oneRow, newFav);
  }

  return (
    <div className="grid-container">
      <div>
        <input
          name="cb-buy"
          type="checkbox"
          onChange={handleBuyChange}
          checked={!!buy} // turn null into false and true stays true
        />
      </div>
      <div>
        <input
          name="cb-fav"
          type="checkbox"
          onChange={handleFavChange}
          checked={!!fav}
        />
      </div>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateQty(oneRow, qty);
          }}
        >
          <input
            className="qty"
            name="qty"
            type="text"
            value={qty}
            onChange={handleQtyChange}
          />
        </form>
      </div>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateName(oneRow, name);
          }}
        >
          <input
            className="item-name"
            name="name"
            type="text"
            value={name}
            onChange={handleNameChange}
          />
        </form>
      </div>
      <div>
        <button
          className="form-button"
          name="delete"
          onClick={() => remove(oneRow._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// Utility functions to fill in a text field as the user types;
// resets the text field to initialVal after the user presses enter
function useInputState(initialVal) {
  const [value, setValue] = useState(initialVal);
  const handleChange = (e) => setValue(e.target.value);
  const reset = () => setValue(initialVal);
  return [value, handleChange, reset];
}

// Displays the navigation bar
function Navbar() {
  return (
    <div className="navbar">
      <a href="#home" className="active">
        Inventory v2
      </a>
      <a href="#print">Print</a>
      <a href="#sort">Sort</a>
      <a href="#about">About</a>
    </div>
  );
}

// Displays the footer with About information
function Footer() {
  return (
    <footer>
      <h3 id="about">About</h3>
      Inventory user interface v2 by John Phillips on April 2, 2021.
      <br />
      <br />
      Source{" "}
      <a href="https://github.com/profphillips/inventory-ui-v2">
        https://github.com/profphillips/inventory-ui-v2
      </a>
      <br />
      <br /> Live page{" "}
      <a href="https://profphillips.github.io/inventory-ui-v2/">
        https://profphillips.github.io/inventory-ui-v2/
      </a>
      <br />
      <br />
      This program uses an api hosted at Heroku. The api uses a Mongodb Atlas
      cloud database to store the data.
      <br />
      <br />
      Source{" "}
      <a href="https://github.com/profphillips/inventory-api-v2">
        https://github.com/profphillips/inventory-api-v2
      </a>
    </footer>
  );
}

//
// ***** API functions *******************************************************
// These functions call the api running on a Heroku server
// which carries out the desired interaction with a mongodb Atlas database.

async function dbGetAllData(setRowDataArray) {
  await axios
    .get("https://inventory-api-v2.herokuapp.com/items")
    .then((response) => {
      setRowDataArray(response.data);
    });
}

async function dbAddNewRow(buy, fav, qty, itemName) {
  const uri = "https://inventory-api-v2.herokuapp.com/items";
  const payload = { buy: buy, fav: fav, qty: qty, name: itemName };
  let result = await axios.post(uri, payload);
  console.log(`db add new row res.data=${result.data}`);
  return result.data;
}

async function dbUpdateRow(row) {
  const uri = "https://inventory-api-v2.herokuapp.com/items/" + row._id;
  const payload = { buy: row.buy, fav: row.fav, qty: row.qty, name: row.name };
  let result = await axios.put(uri, payload);
  return result.data;
}

async function dbRemoveRow(myId) {
  const uri = "https://inventory-api-v2.herokuapp.com/items/" + myId;
  let result = await axios.delete(uri);
  console.log(`db remove=${result.data.deletedCount}`); // make sure it is 1
  return result.data.deletedCount;
}
// ***** End API functions ***************************************************

// ***** End Of File *********************************************************
