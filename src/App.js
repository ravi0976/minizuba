import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';


const App = () => {
  const [orderLines, setOrderLines] = useState([]);
  const [filteredOrderLines, setFilteredOrderLines] = useState([]);
  const [quantityFilter, setQuantityFilter] = useState('');

  useEffect(() => {
    fetchOrderLines();
  }, []);

  const fetchOrderLines = async () => {
    try {
      const response = await axios.get('https://minizuba-fn.azurewebsites.net/api/orderlines?type_id=12');
      setOrderLines(response.data);
      setFilteredOrderLines(response.data);
    } catch (error) {
      console.error('Error fetching order lines:', error);
    }
  };

  const handleQuantityFilterChange = (event) => {
    setQuantityFilter(event.target.value);
    filterOrderLines(event.target.value);
  };

  const filterOrderLines = (quantity) => {
    if (!quantity) {
      setFilteredOrderLines(orderLines);
    } else {
      const filtered = orderLines.filter((orderLine) => orderLine.Quantity === parseInt(quantity));
      setFilteredOrderLines(filtered);
    }
  };

  return (
    <div className="App">
      <h1>Minizuba Packaging UI</h1>
      <div className='text-center'>
        <label htmlFor="quantityFilter">Filter by Quantity: </label>
        <input 
          type="number"
          id="quantityFilter"
          value={quantityFilter}
          onChange={handleQuantityFilterChange}
          placeholder="Enter quantity"
        />
      </div>
      <table class="table table-bordered mt-4">
        <thead>
          <tr>
            <th>OrderLineID</th>
            <th>OrderID</th>
            <th>StockItemID</th>
            <th>Description</th>
            <th>PackageTypeID</th>
            <th>Quantity</th>
            <th>UnitPrice</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrderLines.map((orderLine) => (
            <tr key={orderLine.OrderLineID}>
              <td>{orderLine.OrderLineID}</td>
              <td>{orderLine.OrderID}</td>
              <td>{orderLine.StockItemID}</td>
              <td>{orderLine.Description}</td>
              <td>{orderLine.PackageTypeID}</td>
              <td>{orderLine.Quantity}</td>
              <td>{orderLine.UnitPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
