import React,{useState} from "react";
import {useNavigate} from 'react-router-dom';

const Signup = () => {

    const [credentials, setCredentials] = useState({name:"",email: "", password: "",cpassword:""}) 
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
       const {name,email,password} = credentials;

        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name:credentials.name,email: credentials.email, password: credentials.password})
        });
        const json = await response.json()
        console.log(json);
        if (json.success){
            // Save the auth token and redirect
            localStorage.setItem('token', json.authtoken); 
            navigate("/");//Simply with Navigate we are changing the successful login path from "/login " to "/"(Notes) suuuuuuuuuuiiii
        }
        else{
            alert("Invalid credentials");
        }

       
    }

    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }
    
  return (
    <div className="container mt-2">

        <h2 className="my-2">Create an account to use iNotebook</h2>
      <form onSubmit = {handleSubmit}>
      <div className="my-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            onChange={onChange}
            name="name"
            id="name"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            onChange={onChange}
            id="email"
            name="email"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            onChange={onChange}
            name="password"
            id="password"
            minLength={5}
            required
          />
        </div>

        <div className="mb-3 ">
          <label htmlFor="cpassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            onChange={onChange}
            name="cpassword"
            id="cpassword"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Signup;
