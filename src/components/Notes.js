import React, { useContext, useEffect, useRef, useState } from "react";
import Noteitem from "./Noteitem";
import AddNote from "./AddNote";
import noteContext from "../context/notes/noteContext";
import {useNavigate} from 'react-router-dom';
const Notes = () => {
  const context = useContext(noteContext);
  const { notes, getNotes, editNote } = context;//we are taking what we need from context-> Notestate
  let navigate = useNavigate();
  useEffect(() => {
    if(localStorage.getItem('token'))
    {
    getNotes();
    }
    else
    {
      navigate("/login")
    }
  }, []);

  const ref = useRef(null);
  const refClose = useRef(null);



  const [note, setNote] = useState({
    id:"",
    etitle: "",
    edescription: "",
    etag: "",
  });

  const updateNote = (currentNote) => {
   
   ref.current.click();// we are refererencing Launch Demo button and clicking that when we call this function & .click() is js function
   //document.getElementById("one").click();//we can also use this
 
  setNote({id:currentNote._id,etitle:currentNote.title, edescription:currentNote.description,etag:currentNote.tag})//when we changing the state value after every render it will come to default currentNote values to solve this we are using useRef
  };

  const handleClick = (e) => {
    console.log("Updating the Note ",note)
    editNote(note.id,note.etitle,note.edescription,note.etag)
    refClose.current.click();   
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value }); //Defaultly we are saying whatever the changes with defined name assign those values to the specified name
  };

  return (
    <>
      <AddNote />
      <button
        ref={ref}
        id= "one"
        type="button"
        className="btn btn-primary d-none"//because of d-none it will not appear in FE
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>
     
      <div
        className="modal fade"
        id="exampleModal"//from button targed #exampleModal we are connceting here
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Note
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="my-3">
                <div className="mb-3 ">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etitle"
                    name="etitle"
                    value = {note.etitle}
                    aria-describedby="emailHelp"
                    onChange={onChange}
                    minLength={5} required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="edescription"
                    name="edescription"
                    value = {note.edescription}

                    onChange={onChange}
                    minLength={5} required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="tag" className="form-label">
                    tag
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etag"
                    name="etag"
                    value = {note.etag}

                    onChange={onChange}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
              ref = {refClose}
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button disabled = {note.etitle.length<5 || note.edescription.length<5 } onClick={handleClick} type="button" className="btn btn-primary">
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row my-3">
        <h2>Your Notes</h2>
        <div className = "container mx-2">
        {notes.length===0 && 'No Notes to display'}
        </div>
        {notes.map((note) => {
          return (
            <Noteitem key={note._id} updateNote={updateNote} note={note} />
          );
        })}
      </div>
    </>
  );
};

export default Notes;
