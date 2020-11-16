// Import contact model
Contact = require('../models/base-user');
var jwtUtils = require('../middleware/jwt.utils')
var asyncLib  = require('async');
var bcrypt    = require('bcrypt');
var nodemailer = require("nodemailer");
const fs = require('fs');


// Constants
const EMAIL_REGEX     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX  = /^(?=.*\d).{4,8}$/;





// Get all
/////////////////////////////////////////////
// Handle index actions
exports.index = function (req, res) {
    
Contact.get(function (err, contacts) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json( contacts );
    });
};



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Handle create contact actions
exports.new = function (req, res) {
    var username = req.body.username ;
    var email = req.body.email;
    var Token = req.body.Token;
    var password = req.body.password;
    var name = req.body.name;
    var etat = req.body.etat;
    var phone = req.body.phone;
    var nom = req.body.nom;
    var prenom  = req.body.prenom;
    var image = req.body.image;
 

Contact.findOne({ email}, function(err,req){
  if(req){
    res.json({  message: 'user already exist'});
  }else
    {

      bcrypt.hash(password, 5, function( err, bcryptedPassword ) {
        var contact = new Contact();
        contact.username = username ;
        contact.email = email;
        contact.password =bcryptedPassword;
        contact.name = name;
        contact.etat = 0 ;
        contact.Token = jwtUtils.generateTokenForUser(contact) ;
        contact.phone = phone;
        contact.nom = nom;
        contact.prenom  = prenom; 
        contact.image = "image";
       
    
         
    // save the contact and check for errors
        contact.save(function (err) {
            console.log('******',contact.friend);
            res.json({ contact  });
          
          /*  var transporter = nodemailer.createTransport({
                service : 'gmail',
                auth: { user: 'walidbesrour@gmail.com',
                        pass: 'rourou123456' } });

            var mailOptions = {
                 from: 'walidbesrour@gmail.com',
                 to: 'walid.besrour@esprit.tn',
                 subject:' walid',
                 text: 'http://localhost:8080/api/contacts/'+jwtUtils.generateTokenForUser(contact)};
 

             transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                       return console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
               });*/
   
        });

        
      });

    }

})

};
// change etat
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.etat = function(req , res){
    Contact.findOne({Token: req.params.Token},function(err,contact){
       
        contact.etat = 1 ;
        // save the contact and check for errors
                contact.save(function (err) {
                    if (err)
                        res.json(err);
                    res.json({
                        message: 'Contact Info updated',
                        data: contact
                    });
                });
         



   })
};


// Login whether it exists or not
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.login = function(req , res){
    Contact.findOne({email: req.params.email},function(err,contact){
                
    
     bcrypt.compare( req.params.password, contact.password, function(errBycrypt, resBycrypt) {
        if(resBycrypt){
            res.json( contact );
        }else{
            res.json('nnnnnnnnnnnn')
        }
      });

     if (err)
    {res.json(err);}

   })
};
/*

*/



// add a friend
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.friend = function (req, res) {
    Contact.findById({_id:req.params._id}, function (err, contact) {
           if(err) 
        res.json (err);
        else 
  
        contact.friend.push(req.body._id)
        console.log("*******",req.body._id);

        contact.save(function(err){
            res.json(contact);
        }); 

        }); 
    };  
// Remove a friend 
////////////////////////////////////////////////////////////////////////////////////

exports.delete = function (req, res) {
    Contact.findById({_id:req.params._id}, function (err, contact) {
           if(err) 
        res.json (err);
        else 
  
        contact.friend.pull(req.body._id)
        console.log("*******",contact);

        contact.save(function(err){
            res.json(contact);
        }); 

        }); 
    };

// Get one
///////////////////////////////////////////////////////////////////////////////
exports.one = function (req, res) {
  
 
         
    Contact.findById({_id:req.params._id}).populate('friend')
   // const x =  Contact.findOne({_id:req.params._id}).populate('friend')
   //  console.log('*********',x)
    .then(thing => res.status(200).json(thing.friend))
    .catch(error => res.status(404).json({ error })); 
    
}


// update profil
/////////////////////////////////////////////////////////////////////////////////
exports.profil = function(req,res){
    
    Contact.findById({_id:req.params._id},function (err , contact){
       
    
          contact.image.push(req.file.filename);
          console.log(req.body.image);
          console.log('*******',req.file);

        
          contact.save()
            .then(() => res.status(201).json({ contact}))
            .catch(error => res.status(400).json({ error }));

    });

}

//Remove a picture
//////////////////////////////////////////////////////////////////////////////////

exports.Remove = function(req,res){
    
    Contact.findById({_id:req.params._id},function (err , contact){
       
          contact.image.pull(req.body.image);
    
          contact.save()
            .then(() => res.status(201).json({ message: 'Objet supprimé !',  contact}))
            .catch(error => res.status(400).json({ error }));

             fs.unlink(`images/${req.body.image}`, () => { });

    });

}


exports.profilimage = function(req,res)
{
    Contact.findById({_id:req.params._id},function (err , contact){
     
 

   for (i = 0 ; i<contact.image.length ; i++)
   {
    if(contact.image[i] == req.params.image)
            { 
            contact.imageProfil = contact.image[i].toString(); ;
        
            }
                 
   }
   contact.save()
            .then(() => res.status(201).json({ contact}))
            .catch(error => res.status(400).json({ error }));
  
  });

}

exports.background = function(req,res)
{
    Contact.findById({_id:req.params._id},function (err , contact){
     
 

   for (i = 0 ; i<contact.image.length ; i++)
   {
    if(contact.image[i] == req.params.image)
            { 
            contact.background = contact.image[i].toString(); ;
           
            contact.save()
            .then(() => res.status(201).json({ contact}))
            .catch(error => res.status(400).json({ error }));
            }
                 
   }
  
  });

}



// imaprofil