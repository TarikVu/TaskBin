# TaskBin Kanbanboard

## Table of Contents:
1. [Database Schema](#dbs)
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



## <a name = "apx"></a> Appendix

- Amplify 
    - [Authentication](https://docs.amplify.aws/react/build-a-backend/auth/)
    - [Manage User sessions (get user ID)](https://docs.amplify.aws/react/build-a-backend/auth/connect-your-frontend/manage-user-sessions/)


- MongoDB
    - [Data Modeling](https://www.mongodb.com/docs/manual/data-modeling/)
    - [Embedded Data Versus References](https://www.mongodb.com/docs/manual/data-modeling/concepts/embedding-vs-references/#std-label-data-modeling-referencing)

