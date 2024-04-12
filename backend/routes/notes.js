const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchUser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator"); //npm install --save express-validator

//ROUTE 1: Get All the Notes using: Get "/api/auth/getuser".Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
    console.log(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error occured");
  }
});

//Route 2 : Add a new note using : POST "/api/auth/addnote" .Login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server error occured");
    }
  }
);

//ROUTE 3 : uPDATE AN EXISTING nOTE USING; POST : "api/auth/updatenote". Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    //Create a newNote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //Find the note to be updated and update it
    let note = await Note.findById(req.params.id); //Here we are passing url notes_id to Note schema and searching for that particular Notes data and user
    if (!note) {
      return res.status(404).send("Not Found");
    }
    {
      console.log(note.user.toString());
    } //If by findById it found Note with notes_id in that we also have user id we are taking that user id
    {
      console.log(req.user.id);
    } //From middlewared user details we are taking id
    {
      console.log(req.body);
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    ); //with findByIdAndUpdate we can give parameters and update the object
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error occured");
  }
});

//ROUTE 4 : DELETE AN EXISTING nOTE USING; DELETE : "api/auth/deleteenote". Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    //Create a newNote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //Find the note to be delte and delte it
    let note = await Note.findById(req.params.id); //Here we are passing url notes_id to Note schema and searching for that particular Notes data and user
    if (!note) {
      return res.status(404).send("Not Found");
    }
    {
      console.log(note.user.toString());
    } //If by findById it found Note with notes_id in that we also have user id we are taking that user id
    {
      console.log(req.user.id);
    } //From middlewared user details we are taking id
    {
      console.log(req.body);
    }
    //ALLOW DELETION ONLLY IF USER OWNS THIS NOTE
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id); //with findByIdAndUpdate we can give parameters and update the object
    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error occured");
  }
});

module.exports = router;
