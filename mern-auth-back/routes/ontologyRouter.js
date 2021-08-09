const router = require("express").Router();
const { findByIdAndDelete, findByIdAndUpdate, findOneAndUpdate } = require("../models/ontologyModel");
const Ontology = require("../models/ontologyModel");


router.post("/ontologySubmit", async (req,res) => {
    try{
        let {id,title, description,identifier, keyword} = req.body;

        

        if(!id || !title || !description || !identifier || !keyword)
            return res.status(400).json({msg: "Not all fields have been entered"});
        if(title.length < 3)
            return res.status(400).json({msg: "Title is too small"});
        
        const existingOntology = await Ontology.findOne({
            $and:[
                {identifier: identifier},
                {keyword: keyword}
            ]
            }); 
        if(existingOntology)
            return res.status(400).json({msg: "Object Already exists in DB"});

        
        //create ontology based on ontology model
        const newOntology = new Ontology ({
            id,
            title,
            description,
            identifier,
            keyword
        });
        //save new ontology
        const savedOntology = await newOntology.save();
        res.json(savedOntology);

    } catch(err){
        res.status(500).json({error: err.message});
        
    }

});

router.post("/fileupload", async(req,res) => {
    try{
        

    } catch(err){
        res.status(500).json({error: err.message});
    }

});

router.delete("/ontologyRemove", async(req,res) => {
    try{
        const token = req.header("to-be-removed");
        const deletedOntology = await Ontology.findByIdAndDelete(token);
        res.json(deletedOntology);

    } catch(err){
        res.status(500).json({error: err.message});
    }

});

router.put("/ontologyUpdate", async(req,res) => {
    try{
        const {id,title, description,identifier, keyword} = req.body;
        const updatedOntology = await Ontology.findOneAndUpdate({id: id}, {
            id: id,
            title: title,
            description: description,
            identifier: identifier,
            keyword: keyword})
        
        res.json(updatedOntology);

    } catch(err){
        res.status(500).json({error: err.message});
        
    }
});


router.get("/ontologyList", async(req,res) => { //fetch all data from Ontologies
    try {
        Ontology.find(req.body)
        .then(ontology => res.json(ontology))
    } catch(err){
        res.status(500).json({error: err.message});
    }

});

router.get("/1ontology/:id", async(req,res) => { 
    try {
        Ontology.findById(req.params.id)
        .then(ontology => res.json(ontology))
    } catch(err){
        res.status(500).json({error: err.message});
    }

});







module.exports = router;