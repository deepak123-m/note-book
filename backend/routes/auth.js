const express = require('express');
const User = require('../models/User'); 
const router = express.Router();
const {body,validationResult} = require('express-validator'); //npm install --save express-validator
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchUser')

const JWT_SECRET = "hARRYISAGOODB$OY";

//ROUTE 1 : create a user using : post "/api/auth/createuser", Doesn't require Authentication
//No login required
router.post('/createuser', 
[
    body('name','Enter a valid name').isLength({min:3}),
    body('email', 'Enter a valid email').isEmail(), //2nd parameter is for provider error message when request is made
    body('password', 'password must be atleast 5 characters').isLength({min:5}),
] , async (req,res)      =>       
 {
    let success = false;

 //If there are errors return the Bad request and ther errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) { // if there are errors we will send 400 bad request response
        return res.status(400).json({success,errors: errors.array()});
    }

    //check whether the user with this email exists already
try { //we just created if anything got error in creating user throw 500 error
    let user = await User.findOne({email : req.body.email});//findOne function helps us to check in db from schema 
  
    if(user){
        return res.status(400).json({success,error: "Sorry a user with this email alredy exists"})
    } 
const salt = await bcrypt.genSalt(10);//generates salt with 10 characters for password
const secPass = await bcrypt.hash(req.body.password, salt)

    //create new users
   user = await  User.create({
        name: req.body.name,
        email:req.body.email,
        password: secPass,
    })

    const data = // This is the payload with this + secret key we will give authorization
    {            // 
        user: {
            id:user.id
        }
    }
 const authtoken =   jwt.sign(data, JWT_SECRET); // This is the JWT TOKEN WE WILL SEND TO USER

    success = true;

    res.json({success,authtoken})// IN Response we will seND JWT TOKEN also 
    //.then(user => res.json(user)).catch(err => {console.log(err)
   // res.json({error:"Please enter a unique value", message : err.message})})
   
}
//catch errors
catch(error)
{
    console.error(error.message);
    res.status(500).send("Internal Server error occured");
}
   
 })


     //ROUTE :2  Authenticate a User using : POST "/api/auth/login"
 router.post('/login', [
    body('email','Enter a valid email').isEmail() //If email or password doesn't match my specification they cannot touch my Database
   
 ], async (req,res) => {
    let success = false;
    //If there are errors, return Bad request and ther errors
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error : "Please try to login with correct credentials"});
        }
const passwordCompare = await bcrypt.compare(password, user.password);//This compare method take the entered password converth hash and check with db hashed password
        if(!passwordCompare){
            success = false
            return res.status(400).json({success,error : "Please try to login with correct credentials"});

        }
        const data = {
            user:{
                id: user.id
            }
        }

        const authtoken = jwt.sign(data,JWT_SECRET);
        success = true;
        res.json({success,authtoken})

    }catch (error){
        
    console.error(error.message);
    res.status(500).send("Internal Server error occured");
    }
 })

    //ROUTE :3 Get loggedin User Details using: POST "/api/auth/getuser".  Login required
    
    router.post('/getuser', fetchuser,async (req,res) => {
    try{
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
module.exports = router