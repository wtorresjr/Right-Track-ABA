# Welcome to Right Track ABA!

## Navigation

- [About the project](#about-section)
- [Technologies Used](#technologies-used-section)
- [Routes](#frontend-routes)
- [Screenshots](#screenshots-section)
- [Getting Started](#getting-started-section)
- [Helpful Commands](#helpful-commands-section)
- [Features](#features-section)
- [Acknowledgments](#acknowledgments-section)
<!-- - [Database Schema](https://github.com/wtorresjr/Craftsy-Etsy-Clone/wiki/Database-Schema) -->
<!-- - [User Stories](https://github.com/wtorresjr/Craftsy-Etsy-Clone/wiki/User-Stories) -->

<h2 id="about-section">About The Project</h2>

As an ABA therapist I wanted to create a specialized application tailored for behavior therapists and analysts to enhance client support through efficient data collection. _Right Track ABA_ facilitates the logging of various data points crucial for analysis and intervention planning. These include daily performance data categorized by class activities, documentation of problem behaviors, and discrete trial data. _Right Track ABA_ empowers professionals in the field to optimize client care and intervention strategies effectively.

<h2 id="technologies-used-section">Technologies Used</h2>

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

<h2 id="screenshots-section">Screenshots</h2>

### Login Page

![login page](image-1.png)

### Sign up

![sign up modal](image-2.png)

### Homepage

![homepage](image-3.png)

### Manage Clients

![manage clients page](image-4.png)

### Client Details Page

![client details page](image-6.png)
![client details page lower half](image-8.png)

### Client Daily Chart

![client daily chart](image-9.png)

### Client Discreet Trial

![client discreet trial](image-10.png)

### Client Graph Data

![client graph data](image-11.png)

<h2 id="getting-started-section">Getting Started</h2>

### I. Clone the repository:

`git clone https://github.com/wtorresjr/Craftsy-Etsy-Clone.git`

### II. Install the dependencies (in root directory):

`pipenv install -r requirements.txt`

### III. Set up your environmental variables:

1. Run: `echo > ".env"`
2. Open the _.env.example_ file and copy its contents into your newly created _.env_ file

### IV. Run the following commands:

#### To run the backend server of application:

1. Enter your virtual environment: `pipenv shell`
2. Migrate your database: `flask db upgrade`
3. Seed your database: `flask seed all`
4. Run your server: `flask run`

#### To run the frontend of application:

5. In another terminal, change directory into _react-vite_: `cd react-vite`
6. Install node modules: `npm install`
7. Run your application: `npm start`

<h2 id="helpful-commands-section">Helpful Commands</h2>
<table>
  <thead>
    <tr>
      <th scope="col">Command</th>
      <th scope="col">Description</th>
    </tr>
  </thead>
    <tbody>
    <tr>
      <th scope="row">pipenv shell</th>
      <td>Automatically activates a virtual environment specifically for your project, keeping any dependencies installed isolated.
      <br>
      <br>
      Run <b>deactivate</b> to exit the virtual environment and return to your shell environment.
      </td>
    </tr>
    <tr>
      <th scope="row">pipenv run</th>
      <td>Can activate a virtual environment and run commands like the <b>pipenv shell</b> command; however flask commands must be prepended with this command (e.g., <i>pipenv run flask db upgrade</i> and <i>pipenv run flask run</i>).
      </td>
    </tr>
    <tr>
      <th scope="row">flask run</th>
      <td>When prepended with <b>pipenv run</b>, it activates a virtual environment for your project.
      <br>
      <br>
      Press <b>CTRL + C</b> to exit the virtual envrionment and return to your shell environment.
      </td>
    </tr>
    <tr>
      <th scope="row">flask db upgrade</th>
      <td>Syncs the database schema.</td>
    </tr>
    <tr>
      <th scope="row">flask db downgrade</th>
      <td>Reverts the database schema to the previous state. This is run, followed by <b>flask db upgrade</b> to update the application with any schema changes.</td>
    </tr>
    <tr>
      <th scope="row">flask seed all</th>
      <td>Populates the database with seed file data.</td>
    </tr>
  </tbody>
</table>

<h2 id="features-section">Features</h2>

### New account creation Log in, log out, and guest/demo login:

- Users can sign up, log in, and log out.
- Users can use a demo log in to try the site.
- Users can't use any features without logging in.
- Users who log in are redirected to the home page.
- Users who log are redirected to the login page.

## Manage Clients

### Authenticated Users:

- Should be able to view current client(s).
- Should be able to click client's detail page.
- Should be able to create new client(s).
- Should be able to update client(s) infomation.
- Should be able to delete client(s).
- Should be able to search for client(s).

## Client Details Page

### Authenticated & Authorized Users:

- Should be able to view selected client's details. (Daily Charts, Discreet Trials).
- Should be able to edit or delete current client.
- Should be able to create a new Daily Chart.
- Should be able to edit or delete a Daily Chart.
- Should be able to create a new Discreet Trial.
- Should be able to edit or delete a Discreet Trial.

## Daily Chart Detail Page

### Authenticated Users:

- Should be able to view daily chart details.
- Should be able to add a new interval to the selected chart.
- Should be able to edit or delete intervals.

## Discreet Trial Detail Page

### Authenticated & Authorized Users:

- Should be able to view discreet trial details.
- Should be able to add a new trial to the selected discreet trial.
- Should be able to edit or delete trials.

<h2 id="frontend-routes">Frontend Routes</h2>
<table>
  <thead>
    <tr>
      <th scope="col">Page</th>
      <th scope="col">Path</th>
      <th scope="col">Requires Authentication?</th>
    </tr>
  </thead>
    <tbody>
    <tr>
      <th scope="row">Homepage</th>
      <td>/home</td>
      <td></td>
    </tr>
    <tr>
      <th scope="row">Manage Clients</th>
      <td>/manage-clients</td>
      <td align="center">X</td>
    </tr>
    <tr>
      <th scope="row">Client Details Page</th>
      <td>/client/:client_id</td>
      <td align="center">X</td>
    </tr>
    <tr>
      <th scope="row">Daily Chart Details</th>
      <td>/daily-chart/:chart_id</td>
      <td align="center">X</td>
    </tr>
    <tr>
      <th scope="row">Discreet Trial Details</th>
      <td>/discreet-trial/:dt_id</td>
      <td align="center">X</td>
    </tr>
    <tr>
      <th scope="row">Reports Page</th>
      <td>/view-reports</td>
      <td align="center">X</td>
    </tr>
  </tbody>
</table>

<h4 id="acknowledgments-section">Acknowledgments</h4>

- Icons by [_Font Awesome_](https://fontawesome.com/icons)
