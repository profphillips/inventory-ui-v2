// This React app maintains a simple inventory list. The design goal was to
// put all of the functions in a single file to help study how they work.

// Mongodb/Atlas storage is accessed via an api running on a Heroku server.
// Both Atlas and Heroku are free accounts.

// by John Phillips on 2021-02-24 revised 2021-02-25
// v2 on 2021-03-19 revised 2021-04-01

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

//
// ***** Main React function *************************************************
function App() {
  // Create a React state array and a function to change the data.
  // rowDataArray contains all of our inventory data organized by row.
  let [rowDataArray, setRowDataArray] = useState([]);

  // Retrieve inventory data from the db and place in our array.
  useEffect(() => {
    dbGetAllData(setRowDataArray);
  }, []); // ignore warning - empty dependency array [] so only executed once

  // Any time rowDataArray changes then this hook will automatically be called.
  // Uncomment the following to console view the rowDataArray as it is updated.
  useEffect(() => {
    console.log("second useEffect runs whenever the rowDataArray changes");
    console.log(rowDataArray);
  }, [rowDataArray]);

  async function addNewRow(isBuy, isFav, qty, itemName) {
    // add row to db and get new id back
    const buy = isBuy ? true : false;
    const fav = isFav ? true : false;
    console.log("buy=", buy);
    console.log("fav=", fav);
    let newId = await dbAddNewRow(buy, fav, itemName, qty);
    const newRow = { _id: newId, buy: buy, fav: fav, qty: qty, name: itemName };
    setRowDataArray([...rowDataArray, newRow]);
  }

  function updateRowBuy(row2update, isBuy) {
    const buy = isBuy ? true : false;
    // just update qty and leave name and id as is
    const updatedRow = {
      _id: row2update._id,
      buy: buy,
      fav: row2update.fav,
      qty: row2update.qty,
      name: row2update.name,
    };
    // check each row for the matching id and if found return the updated row
    const updatedItems = rowDataArray.map((row) => {
      if (row._id === row2update._id) {
        return updatedRow;
      }
      return row;
    });
    setRowDataArray(updatedItems);
    dbUpdateRow(updatedRow);
  }
  function updateRowFav(row2update, isFav) {
    const fav = isFav ? true : false;
    // just update qty and leave name and id as is
    const updatedRow = {
      _id: row2update._id,
      buy: row2update.buy,
      fav: fav,
      qty: row2update.qty,
      name: row2update.name,
    };

    // check each row for the matching id and if found return the updated row
    const updatedItems = rowDataArray.map((row) => {
      if (row._id === row2update._id) {
        return updatedRow;
      }
      return row;
    });
    setRowDataArray(updatedItems);
    dbUpdateRow(updatedRow);
  }
  function updateRowQty(row2update, qty) {
    // just update qty and leave name and id as is
    const updatedRow = {
      _id: row2update._id,
      buy: row2update.buy,
      fav: row2update.fav,
      qty: qty,
      name: row2update.name,
    };
    // check each row for the matching id and if found return the updated row
    const updatedItems = rowDataArray.map((row) => {
      if (row._id === row2update._id) {
        return updatedRow;
      }
      return row;
    });
    setRowDataArray(updatedItems);
    dbUpdateRow(updatedRow);
  }
  function updateRowName(row2update, itemName) {
    // just update qty and leave name and id as is
    const updatedRow = {
      _id: row2update._id,
      buy: row2update.buy,
      fav: row2update.fav,
      qty: row2update.qty,
      name: itemName,
    };
    // check each row for the matching id and if found return the updated row
    const updatedItems = rowDataArray.map((row) => {
      if (row._id === row2update._id) {
        return updatedRow;
      }
      return row;
    });
    setRowDataArray(updatedItems);
    dbUpdateRow(updatedRow);
  }
  function removeRow(id2delete) {
    // filter out any row where the ids don't match
    const updatedItems = rowDataArray.filter((row) => row._id !== id2delete);
    setRowDataArray(updatedItems);
    dbRemoveRow(id2delete);
  }

  return (
    <div>
      <div className="Wrapper">
        <Navbar />
        <ColumnNames />
        <InputForm addNewRow={addNewRow} className="InputForm" />
        {rowDataArray.map((oneRow) => (
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
        <Footer />
      </div>
    </div>
  );
}
// ***** End Main function ***************************************************

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

// Display's empty checkboxes, item name, and qty text fields;
// when submitted it adds a new row of data.
function InputForm({ addNewRow }) {
  const [name, handleNameChange, resetNameField] = useInputState("");
  const [qty, handleQtyChange, resetQtyField] = useInputState("1");
  const [buy, setBuy] = useState(false);
  const [fav, setFav] = useState(false);

  function handleCheckBuyChange() {
    setBuy(!buy);
  }

  function handleCheckFavChange() {
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
          resetNameField();
          resetQtyField();
          setBuy(false);
          setFav(false);
          focus(); // returns focus to item name textbox after submit
        }}
      >
        <div className="grid-container">
          <div>
            <input
              name="checkBuy"
              type="checkbox"
              onChange={handleCheckBuyChange}
              checked={!!buy} // turn null into false and true stays true
            />
          </div>
          <div>
            <input
              name="checkFav"
              type="checkbox"
              onChange={handleCheckFavChange}
              checked={!!fav}
            />
          </div>
          <div>
            <input
              className="qty"
              type="text"
              value={qty}
              placeholder="Qty"
              onChange={handleQtyChange}
              label="Add New Quantity"
            />
          </div>
          <div>
            <input
              className="itemName"
              type="text"
              value={name}
              placeholder="New Item"
              onChange={handleNameChange}
              label="Item"
              autoFocus
              ref={textInput} // returns focus to first textbox after submit
            />
          </div>
          <div>
            <button type="submit" className="form-button">
              Add
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

// Displays a single row of data with a delete button.

function ListRow({
  oneRow,
  remove,
  updateBuy,
  updateFav,
  updateQty,
  updateName,
}) {
  const [name, handleNameChange] = useInputState(oneRow.name);
  const [qty, handleQtyChange] = useInputState(oneRow.qty);
  const [buy, setBuy] = useState(oneRow.buy);
  const [fav, setFav] = useState(oneRow.fav);

  function handleCheckBuyChange() {
    const newBuy = !buy;
    setBuy(newBuy);
    updateBuy(oneRow, newBuy);
  }
  function handleCheckFavChange() {
    const newFav = !fav;
    setFav(newFav);
    updateFav(oneRow, newFav);
  }

  return (
    <div className="grid-container">
      <div>
        <input
          name="checkBuy"
          type="checkbox"
          onChange={handleCheckBuyChange}
          checked={!!buy}
        />
      </div>
      <div>
        <input
          name="checkFav"
          type="checkbox"
          onChange={handleCheckFavChange}
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
            label="Update quantity"
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
            name="name"
            className="itemName"
            type="text"
            value={name}
            onChange={handleNameChange}
            label="Update item name"
          />
        </form>
      </div>
      <div>
        <button
          className="form-button"
          aria-label="Delete"
          onClick={() => remove(oneRow._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// utility functions to fill in a text field as the user types;
// resets the text field to initialVal after the user presses enter
function useInputState(initialVal) {
  const [value, setValue] = useState(initialVal);
  const handleChange = (e) => setValue(e.target.value);
  const reset = () => setValue(initialVal);
  return [value, handleChange, reset];
}

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

function Footer() {
  return (
    <footer>
      Inventory table with Mongodb Atlas storage by John Phillips on March 20,
      2021. Source at{" "}
      <a href="https://github.com/profphillips/inventory-ui-v2">
        https://github.com/profphillips/inventory-ui-v2
      </a>
      . Live page at{" "}
      <a href="https://profphillips.github.io/inventory-ui-v2/">
        https://profphillips.github.io/inventory-ui-v2/
      </a>
      .
    </footer>
  );
}

//
// ***** API functions *******************************************************
// These functions call the api running on a Heroku server
// and carries out the desired interaction with a mongodb Atlas database.

// const dbGetAllData = async (setRowDataArray) => { // alternative syntax
async function dbGetAllData(setRowDataArray) {
  await axios
    .get("https://inventory-api-v2.herokuapp.com/items")
    .then((response) => {
      setRowDataArray(response.data);
    });
}

async function dbAddNewRow(buy, fav, itemName, qty) {
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
//

// utility function to toggle a state from false to true and back
// function useToggle(initialVal = false) {
//   const [state, setState] = useState(initialVal);
//   const toggle = () => setState(!state);
//   return [state, toggle];
// }

// ***** End Of File *********************************************************
