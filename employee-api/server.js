const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;
const dataFilePath = './employees.json';

app.use(bodyParser.json());
app.use(cors());

// Helper functions to read and write to the JSON file
const readData = () => {
    const jsonData = fs.readFileSync(dataFilePath);
    return JSON.parse(jsonData);
};

const writeData = (data) => {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(dataFilePath, jsonData);
};

// Route for the root path
app.get('/', (req, res) => {
    res.send('Employee API is running');
});

// CRUD Endpoints
app.get('/employees', (req, res) => {
    const employees = readData();
    res.send(employees);
});

app.get('/employees/:id', (req, res) => {
    const employees = readData();
    const employee = employees.find(emp => emp.id === parseInt(req.params.id));
    if (!employee) return res.status(404).send('Employee not found');
    res.send(employee);
});

app.post('/employees', (req, res) => {
    const employees = readData();
    const newEmployee = {
        id: employees.length ? employees[employees.length - 1].id + 1 : 1,
        ...req.body
    };
    employees.push(newEmployee);
    writeData(employees);
    res.send(newEmployee);
});

app.put('/employees/:id', (req, res) => {
    const employees = readData();
    const employeeIndex = employees.findIndex(emp => emp.id === parseInt(req.params.id));
    if (employeeIndex === -1) return res.status(404).send('Employee not found');
    
    const updatedEmployee = { id: parseInt(req.params.id), ...req.body };
    employees[employeeIndex] = updatedEmployee;
    writeData(employees);
    res.send(updatedEmployee);
});

app.delete('/employees/:id', (req, res) => {
    const employees = readData();
    const employeeIndex = employees.findIndex(emp => emp.id === parseInt(req.params.id));
    if (employeeIndex === -1) return res.status(404).send('Employee not found');
    
    const deletedEmployee = employees.splice(employeeIndex, 1);
    writeData(employees);
    res.send(deletedEmployee[0]);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
