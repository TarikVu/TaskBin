import { useState, useEffect } from "react";
import {
  Authenticator,
  Button,
  Text,
  TextField,
  Heading,
  Flex,
  View,
  Image,
  Grid,
  Divider,
} from "@aws-amplify/ui-react";

import { Amplify } from "aws-amplify";
//import { MongoClient } from "mongodb";
import { getCurrentUser } from 'aws-amplify/auth';

import "@aws-amplify/ui-react/styles.css";
// import { getUrl } from "aws-amplify/storage";
// import { uploadData } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";

import outputs from "../amplify_outputs.json";

import NavBar from "./navbar";
import Board from "./board";

// Amplify Setup
Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

/* // MongoDB Database Setup
const uri = 'mongodb+srv://TaskBinFree:Dr4gonRoll%21@taskbinfree.p0skw.mongodb.net/?retryWrites=true&w=majority&appName=TaskBinFree';
const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connect() {
  try {
    await dbClient.connect();
    console.log('Connected to MongoDB');
  } catch (e) {
    console.error(e);
  }
}
 */
// App Component
export default function App() {
  /* const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }

    fetchUser();
  }, []);

  useEffect(() => {
    connect();
  }, []); */

  return (
    <Authenticator>
      {({ signOut }) => (
        <Flex>
          <NavBar onButtonClick={signOut} />
          <Board/>
         {/*  <div>{currentUser ? `UserID: ${currentUser.userId}` : 'Loading user...'}</div>
         */}
         </Flex>
      )}
    </Authenticator>
  );
}

