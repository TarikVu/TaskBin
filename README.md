# TaskBin Kanbanboard

## Table of Contents:
1. [Database Schema](#dbs)
1. [Design choices](#design)
1. [Appendix](#apx)

## Technical Stack:
| Stack     | Technology         | Notes | 
|-----------|--------------------|-------|
|Front End  | React              | N/A   |  
|Back End   | JavaScript         | N/A   |  
|Database   | MongoDB (Mongoose) | N/A   |  
|Deployment | AWS (Amplify)      | N/A   |  

## <a name = "DBS"></a> Database Schema 
The database for TaskBin will Utilize MongoDB as a NoSQL Database.
The data stored is heiarchal, and will be therefore Referenced with one-to many relationships as shown in the image below. See more on MongoDB
![schemaImg](https://github.com/TarikVu/imgs/blob/main/TaskBin/TaskBinDB.PNG?raw=true)

## <a name = "design"></a> Design Choices
### 1. CRUD upon change & Optimistic UI changes  
Updating the front and back end simultaneously poses 2 options,
As soon as a change is made, update the UI locally and send an async CRUD operation to the DB. Upon an **Error** response from the DB, revert the changes client side and alert the user.

*Pros*:
- Allows multiple users on a Kanban board simultaneously. (Planned Feature)
- Real Time updates
- Data Consistency
    
*Cons*:
- Possible performance issues
- Network dependency

### 2. Backend structure & Save Changes option.
Record all changes on a backend data structure and update the Database with the user hits "Save".

*Pros*:
-  Performance improvements due to less database queries.
- Users can make changes without worrying about DB changes until specified.
    
*Cons*:
- Data loss due to unexpected crashes
- Data Consistency between simultaneous users.

### **Option 1 Chosen**

## <a name = "apx"></a> Appendix

- Amplify 
    - [Authentication](https://docs.amplify.aws/react/build-a-backend/auth/)
    - [Manage User sessions (get user ID)](https://docs.amplify.aws/react/build-a-backend/auth/connect-your-frontend/manage-user-sessions/)


- MongoDB
    - [Data Modeling](https://www.mongodb.com/docs/manual/data-modeling/)
    - [Embedded Data Versus References](https://www.mongodb.com/docs/manual/data-modeling/concepts/embedding-vs-references/#std-label-data-modeling-referencing)


## Other

(Next steps:)
rewatch the video and look into using the .env file. later when app is deployed
the fetch requests from the front end will need their uri's changed in order
to communicate with the deployed backend.  Also note 
Ensure that your deployment environment (like EC2, AWS Lambda, Heroku, etc.) is properly configured to handle CORS (Cross-Origin Resource Sharing) if your frontend and backend are on different domains.

- Issue 8/28 setup project again with create react app 
```
npx create-react-app my-react-app
```
should have this setup with a public folder, running on laptop is giving errors. very weird why i can run npm start on my desktop but not my laptop...
```
my-react-app/
├── node_modules/
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── index.js
│   └── ...
├── .gitignore
├── package.json
├── README.md
└── yarn.lock or package-lock.json
```
