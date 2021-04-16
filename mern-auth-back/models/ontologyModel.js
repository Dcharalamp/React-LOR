const mongoose = require("mongoose");

//create ontology schema
const ontologySchema = new mongoose.Schema({
    id: {type: String, required:true},
    title:{type: String, required:true},
    description: {type: String},
    identifier: {type: String}, //proc URL
    keyword: [{type: String}],

});

module.exports = Ontology = mongoose.model("ontologies", ontologySchema);