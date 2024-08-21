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
import "@aws-amplify/ui-react/styles.css";
//import { getUrl } from "aws-amplify/storage";
//import { uploadData } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";

import outputs from "../amplify_outputs.json";

import NavBar from "./navbar";
import Board from "./board";

/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

export default function App() {


  return (
    <Authenticator>
      {({ signOut }) => (
        <Flex>
          <NavBar onButtonClick={signOut} />
          <Board/>
        </Flex>
      )}
    </Authenticator>
  );
}