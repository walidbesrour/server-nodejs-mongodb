// Initialize express router
let router = require('express').Router();
// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!',
            });
});
// Import contact controller
var contactController = require('../controllers/usersCtrl');
// Import multer 
const multer = require('../middleware/multer-config');

// Contact routes
router.route('/contacts')
    .get(contactController.index)
    .post(contactController.new);
    
router.route('/contacts/:Token')
    .get(contactController.etat);

router.route('/login/:email/:password')
    .get(contactController.login);
 
router.route('/friend/:_id')
    .get(contactController.one)
    .post(contactController.friend)
    .delete(contactController.delete);

router.route('/profil/:_id')
    .post(multer,contactController.profil)
    .delete(multer,contactController.Remove);

router.route('/imageProfil/:_id/:image')
    .get(multer,contactController.profilimage)

router.route('/imagebackground/:_id/:image')
    .get(multer,contactController.background)



// Export API routes
module.exports = router;