import { createContext } from "react";

const noteContext = createContext(); // created context from here I can access 
//We created NoteState.js because whenever we want to use context we need import 2 times so I created NoteState by it we can run once
export default noteContext;