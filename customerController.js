const fs = require('fs');
//load customer details from customer.json file
const customers = require('./customers.json');

// Get all customer with search & pagination
function getCustomer(req, res) {
    const { page = 1, limit = 10, search } = req.query;
    let filteredCustomers = customers;
  
    // Apply search filter if provided
    if (search) {
      filteredCustomers = filteredCustomers.filter((customer) => {
        const fullName = customer.first_name + ' ' + customer.last_name;
        return fullName.toLowerCase().includes(search.toLowerCase()) || customer.city.toLowerCase() === search.toLowerCase();
      });
    }
  
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
  
    res.json({
      totalCustomers: filteredCustomers.length,
      currentPage: parseInt(page),
      customers: paginatedCustomers,
    });
}

//Get customer details by ID
function getCustomerByID(req, res) {
    const customerId = parseInt(req.params.id);
    const customer = customers.find((c) => c.id === customerId);
  
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
  
    res.json(customer);
}

//list all the unique cities with number of customers
function getCities(req, res) {
    const cityCounts = {};
    customers.forEach((customer) => {
      const city = customer.city;
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    });
    res.json(cityCounts);
}

// add a customer with validations
function addCustomer(req, res) {
  const addNewCustomer = req.body;
  // Validate required fields
  if (!addNewCustomer.id || !addNewCustomer.first_name || !addNewCustomer.last_name || !addNewCustomer.city || !addNewCustomer.company) {
      return res.status(400).json({ error: 'All fields are required' });
  }else{
    // Check if the city and company already exist 
    const existingCustomer = customers.find((customer) => {
      return customer.city === addNewCustomer.city || customer.company === addNewCustomer.company;
    });

    if (existingCustomer) {
      return res.status(400).json({ error: 'Customer with the same city and company already exists' });
    }else{
      // Add the new customer to the list
      customers.push(addNewCustomer);

      // Save the updated customer data to the JSON file
      fs.writeFileSync('./customers.json', JSON.stringify(customers, null, 2), 'utf-8');

      res.status(201).json({ message: 'Customer added successfully', customer: addNewCustomer });
    }
  }
}

  
  module.exports = {
    getCustomer,
    getCustomerByID,
    getCities,
    addCustomer
  };