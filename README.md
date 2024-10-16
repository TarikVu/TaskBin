# TaskBin Kanbanboard (Pre-alpha)
Preview:
![prealpha](https://github.com/TarikVu/imgs/blob/main/TaskBin/taskbin_pre-alpha.png?raw=true)
## Table of Contents:
1. [Database Schema](#dbs)
1. [Design choices](#design)
1. [User Authentication](#auth)
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
<img src="https://github.com/TarikVu/imgs/blob/main/TaskBin/TaskBinDB.PNG?raw=true" style="width: 75%;" alt="Description">


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

## <a name = "auth"></a> User Authentication

[Article on User Auth with MERN](https://enlear.academy/how-to-securely-authenticate-and-authorize-users-with-node-js-express-mongodb-b57373731efc)
## <a name = "apx"></a> Appendix

- ~~Amplify~~ 
    - [Authentication](https://docs.amplify.aws/react/build-a-backend/auth/)
    - [Manage User sessions (get user ID)](https://docs.amplify.aws/react/build-a-backend/auth/connect-your-frontend/manage-user-sessions/)


- MongoDB
    - [Data Modeling](https://www.mongodb.com/docs/manual/data-modeling/)
    - [Embedded Data Versus References](https://www.mongodb.com/docs/manual/data-modeling/concepts/embedding-vs-references/#std-label-data-modeling-referencing)


 
