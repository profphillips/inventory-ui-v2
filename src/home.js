// Displays the main inventory table.

// by John Phillips on 2021-02-24 revised 2021-02-25
// v2 on 2021-03-19 revised 2021-04-05

import React, { useState, useEffect } from "react";
import { dbGetAllData, dbAddNewRow, dbUpdateRow, dbRemoveRow } from "./dbapi";
import Footer from "./footer";

// ***** Main function *******************************************************
export default function Home() {
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

  // When the item is changed update the array and then the db.
  function updateAll(row2update, buy, fav, qty, itemName) {
    const updatedRow = {
      _id: row2update._id,
      buy: buy,
      fav: fav,
      qty: qty,
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
        <ColumnNames />
        <InputForm addNewRow={addNewRow} className="InputForm" />
        {dataArray.map((oneRow) => (
          <ListRow
            key={oneRow._id}
            oneRow={oneRow}
            remove={removeRow}
            updateAll={updateAll}
          />
        ))}
        <Footer />
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
              type="number"
              value={qty}
              placeholder="Qty"
              onChange={handleQtyChange}
              required={true}
              autoComplete="off"
            />
          </div>
          <div>
            <input
              className="item-name"
              name="itemName"
              type="text"
              value={name}
              placeholder="Type here then press plus"
              onChange={handleItemNameChange}
              required={true}
              autoComplete="off"
              autoFocus
              ref={textInput} // returns focus to name textbox after submit
            />
          </div>
          <div>
            <button className="form-button" name="addButton" type="submit">
              ➕
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
  updateAll,
}) {
  const [buy, setBuy] = useState(oneRow.buy);
  const [fav, setFav] = useState(oneRow.fav);
  const [qty, handleQtyChange] = useInputState(oneRow.qty);
  const [name, handleNameChange] = useInputState(oneRow.name);

  function handleBuyChange() {
    const newBuy = !buy;
    setBuy(newBuy);
    updateAll(oneRow, newBuy, fav, qty, name);
  }

  function handleFavChange() {
    const newFav = !fav;
    setFav(newFav);
    updateAll(oneRow, buy, newFav, qty, name);
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
            updateAll(oneRow, buy, fav, qty, name);
          }}
        >
          <input
            id={oneRow._id + "qty"}
            className="qty"
            name="qty"
            type="number"
            value={qty}
            onChange={handleQtyChange}
            required={true}
            autoComplete="off"
          />
        </form>
      </div>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateAll(oneRow, buy, fav, qty, name);
          }}
        >
          <input
            id={oneRow._id + "name"}
            className="item-name"
            name="name"
            type="text"
            value={name}
            onChange={handleNameChange}
            required={true}
            autoComplete="off"
          />
        </form>
      </div>
      <div>
        <button
          className="form-button-cloud"
          name="update"
          onClick={() => {
            console.log("qty=", qty);
            updateAll(oneRow, buy, fav, qty, name);
          }}
        >
          ☁️
        </button>
        <button
          className="form-button-delete"
          name="delete"
          onClick={() => remove(oneRow._id)}
        >
          🗑
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

// ***** End Of File *********************************************************
