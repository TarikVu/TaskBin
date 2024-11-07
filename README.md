
# TaskBin Kanbanboard (BETA)
[TaskBin ↗](http://ec2-35-175-202-164.compute-1.amazonaws.com:5000/)
A simple task manager organizer created the MERN stack and hosted on AWS (EC2).
This application was a solid starting point for learning a new language and Tech stack, featuring front-end features such as drag and drop, user authentication, password encryption, and performing CRUD operations on the Server's RESTFUL API.
![prealpha](https://raw.githubusercontent.com/TarikVu/imgs/refs/heads/main/TaskBin/taskbin_pre-alpha.png)

## Table of Contents:
1. [Features](#dbs) 
2. [Project Structure](#struct)
3. [Technologies Used](#tech) 
4. [Wiki for full Documentation ↗](https://github.com/TarikVu/TaskBin/wiki)
 

## <a name = "feats"></a>Features
### Beta Release
- **Board Management**: Create, update, and delete boards to organize tasks.
-  **User Authentication**: Secure signup and login system with JWT authentication and password encryption.
- **Drag-and-Drop Support**: Easily rearrange columns and tasks within the board.
- **Column & Card Handling**: Add, edit, delete, and reorder columns & cards  within each board.
### Planned Features
- **Real-Time Updates**: Stay in sync with instant updates across multiple devices.
- **Advanced Card Organization**: Add  Filtering by priority levels, and due dates.
- **In-Depth customization**: Add user preferences and color customization options. 

## <a name = "struct"></a>Project Structure
### Client:
Holds the front end code built with React to be served via the server to connecting browsers.
The front end code is organized into routes, components, utilities for fetching the API, forms for user input recording, and Jest unit tests. 
### Server:
Holds the backend code built with Express to be served to connecting clients and performs CRUD operations on MongoDB. 
The backend code is organized into middleware, database models, and jest unit tests directories.

## <a name = "tech"></a>Technologies Used
| Aspect     | Technology         | 
|-----------|--------------------|
|Front End  | React              | 
|Back End   | Express            |   
|Database   | MongoDB  			 | 
|Deployment | AWS (EC2)          | 
|Language(s)| JavaScript         | 
