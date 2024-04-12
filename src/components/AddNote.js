import noteContext from "../context/notes/noteContext";
import React, {useState,useContext} from "react";

 
const AddNote = () => {
  const context = useContext(noteContext);
  const {addNote} = context;
  const [note, setNote] = useState({title:"",description:"",tag:""})

  const handleClick = (e) =>{
    e.preventDefault();//we are using for not reload actually this function helps to not follow href link & make sure submit button will not submit like those
    console.log(note)
    addNote(note.title,note.description,note.tag);
    setNote({title:"",description:"",tag:""})
  }
  
  const onChange = (e)=>{
    

    setNote({...note, [e.target.name] : e.target.value})//Defaultly we are saying whatever the changes with defined name assign those values to the specified name

  }
    return (
        <>
        <div className="container my-3 ">
        <h2>Add a Note</h2>
        <form className="my-3">
          <div className="mb-3 ">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name = "title"
              value = {note.title}
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
              id="description"
              value = {note.description}

              name = "description"
              onChange= {onChange}
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
              id="tag"
              value = {note.tag}

              name = "tag"
              onChange= {onChange}
             
            />
          </div>
         
          <button disabled = {note.title.length<5 || note.description.length<5 }type="submit" className="btn btn-primary" onClick={handleClick}>
            Add Note
          </button>
        </form>
      </div>
      <div className="container">
       
      </div>
      </>
    )
}

export default AddNote