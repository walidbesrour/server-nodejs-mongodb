var mongoose = require('mongoose');
// Setup schema
var contactSchema = mongoose.Schema({
    username: String ,

    email: String ,

    password:  String,
    
    name: String,

    etat: Boolean,

    phone: Number,
    
    imageProfil : String ,

    background : String ,

    image : [String],

    nom : String,

    prenom : String,

    Token : String ,


    
    friend : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' 
        
    }],

   
});
// Export Contact model
var Contact = module.exports = mongoose.model('user', contactSchema);
module.exports.get = function (callback, limit) {
    Contact.find(callback).limit(limit);
}