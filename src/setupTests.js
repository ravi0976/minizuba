import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import App from './App';

// Mock Axios for API requests
jest.mock('axios');

describe('App component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls between tests
  });

  it('fetches order lines on component mount', async () => {
    // Mock response data
    const responseData = [
      { OrderLineID: 1, OrderID: 101, StockItemID: 201, Description: 'Product 1', PackageTypeID: 1, Quantity: 10, UnitPrice: 5.0 },
      { OrderLineID: 2, OrderID: 102, StockItemID: 202, Description: 'Product 2', PackageTypeID: 2, Quantity: 20, UnitPrice: 10.0 }
    ];

    // Mock Axios get method
    axios.get.mockResolvedValueOnce({ data: responseData });

    // Render the component
    const { getByText } = render(<App />);

    // Check if order lines are fetched and displayed
    await waitFor(() => {
      expect(getByText('Product 1')).toBeInTheDocument();
      expect(getByText('Product 2')).toBeInTheDocument();
    });
  });

  it('filters order lines by quantity', async () => {
    const responseData = [
      { OrderLineID: 1, OrderID: 101, StockItemID: 201, Description: 'Product 1', PackageTypeID: 1, Quantity: 10, UnitPrice: 5.0 },
      { OrderLineID: 2, OrderID: 102, StockItemID: 202, Description: 'Product 2', PackageTypeID: 2, Quantity: 20, UnitPrice: 10.0 }
    ];

    axios.get.mockResolvedValueOnce({ data: responseData });

    const { getByLabelText, getByText } = render(<App />);

    // Simulate entering quantity in the filter input
    fireEvent.change(getByLabelText('Filter by Quantity: '), { target: { value: '20' } });

    // Check if filtered order line is displayed
    await waitFor(() => {
      expect(getByText('Product 2')).toBeInTheDocument();
    });

    // Check if other order line is not displayed
    expect(getByText('Product 1')).not.toBeInTheDocument();
  });
});
