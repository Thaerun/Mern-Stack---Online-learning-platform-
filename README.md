# Naan Mudhalvan: Online Learning Platform

This project is developed as part of the **Naan Mudhalvan Program**. The course is **MERN Stack Powered by MongoDB** **(subject code: NM1042)**, conducted for **Tagore Engineering College** **(College Code: 4127)**. This online learning platform enables students and instructors to interact in a collaborative digital environment. The platform is built using the MERN (MongoDB, Express, React, Node.js) stack.

---

## Project Team

<!-- | Name             | Register Number | Departemnt and Class    |Naan Mudhalvan ID                          |
|------------------|-----------------|-------------------------|-------------------------------------------|
| Dhineshkumar M   | 412721104012    | B.E CSE IV Year 7th Sem | 907993F6A474801BD6448EB4374621E5          |
| Balachandar S    | 412721104007    | B.E CSE IV Year 7th Sem | A58E5EEAA518FF4BE3743FF4DEA696D0          |
| Dayanithi M      | 412721104009    | B.E CSE IV Year 7th Sem | 2E6CCD61AB2AA0286B044A5C1C459B47          |
| Praveenkumar M   | 412721104035    | B.E CSE IV Year 7th Sem | 63281C82F9EBA459648408F0CF6E29E9          | -->

| Name             | Register Number | Naan Mudhalvan ID                         |
|------------------|-----------------|-------------------------------------------|
| Dhineshkumar M   | 412721104012    | 907993F6A474801BD6448EB4374621E5          |
| Balachandar S    | 412721104007    | A58E5EEAA518FF4BE3743FF4DEA696D0          |
| Dayanithi M      | 412721104009    | 2E6CCD61AB2AA0286B044A5C1C459B47          |
| Praveenkumar M   | 412721104035    | 63281C82F9EBA459648408F0CF6E29E9          |

We are the students of **Computer Science and Engineering** (CSE) department pursuing **IV Year 7th semester.**

---


## Project Description

**Project Name:** Online Learning Platform using MERN

This online learning platform is designed to enhance student engagement and facilitate instructor-student interaction through a user-friendly, feature-rich web interface. It includes features like course enrollment, access to educational content, forum discussions, and profile management. This web app is built with the MERN stack, ensuring a seamless user experience and efficient data management.


**Project Report:** [View the full project report (PDF)](./Online%20Learning%20Platform%20using%20MERN%20-%20Report.pdf)


---

## Steps to Run the Application Locally

Follow these steps to set up the application on your local machine

### 1. Clone the Repository

```bash
    git clone https://github.com/dk172923/online-learning-platform.git
```

### 2. Navigate to the cloned repository

```bash 
    cd online-learning-platform
```

### 3. Configuration Settings
Rename the environment file in the client side.
```bash
    Rename .env.local1 to .env.local
```

### 4. Setting up the frontend
Open a new terminal in VS Code and run the following commands to install the required packages and start the frontend

```bash
    cd Client
    npm install   # install the required packages
    npm run dev
```
Open a browser and navigate to http://localhost:5173 to access the frontend of the application.

### 5. Setting up the backend
Open another terminal in VS Code and run the following commands to install the necessary packages and start the backend server

```bash 
    cd server
    npm install      # install the required packages
    node server.js   # or use nodemon for automatic restarts with `nodemon server.js`
```
The backend server will start on **PORT 5000** by default. You can adjust this setting in the .env file if needed.

---

## Technologies Used

- **Frontend**: React, HTML, CSS, JavaScript, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Environment Management**: dotenv

---

## Additional Information

For further assistance or doubts, reach out to any team member listed above or find their GitHub ID from the collaborators list.

---
