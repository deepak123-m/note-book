import NoteContext from "./noteContext";
import { useState } from "react";
const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);
  //Get All Notes
  const getNotes = async () => {
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token')      },
    });
    //Logic to edit in client
    const json = await response.json();
    console.log(json);
    setNotes(json);
  };

  //Add a Note

  const addNote = async (title, description, tag) => {
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token')      },
      body: JSON.stringify({ title, description, tag }),
    });
    const note = await response.json();
    setNotes(notes.concat(note));


  };
  //Delete a Note
  const deleteNote = async(id) => {
    const response = await fetch (`${host}/api/notes/deletenote/${id}`,{
      method:'DELETE',
      headers:{
        'Content-Type':'application/json',
        "auth-token": localStorage.getItem('token')
      },
    });
    const json = response.json();

    const newNotes = notes.filter((nte) => {
      return nte._id !== id;
    }); //we are returning all the notes which doesn't contain the id (which we passed as parameter id)
    setNotes(newNotes);
  };

  //Edit a Note

  const editNote = async (id, title, description, tag) => {
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token')      },
      body: JSON.stringify({ title, description, tag }),
    });
    //Logic to edit in client
    const json = await response.json();


   let newNotes = JSON.parse(JSON.stringify(notes))


    for (let index = 0; index < notes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    
    }
    setNotes(newNotes);
  };

  return (
    <NoteContext.Provider
      value={{ notes, addNote, editNote, deleteNote, getNotes }}
    >
      {props.children} {/*children components passing props*/}
    </NoteContext.Provider>
  );
};

export default NoteState;
