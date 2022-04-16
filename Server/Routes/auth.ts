import express from 'express';
const router = express.Router();

// import controller instance
import { DisplayLoginPage, DisplayRegisterPage, ProcessLoginPage, ProcessLogoutPage, ProcessRegisterPage } from '../Controllers/auth';

/******************************************* AUTHENTICATION ROUTES **********************/

/* GET login page. */
router.get('/login', DisplayLoginPage);

/* Process the Login Request */
router.post('/login', ProcessLoginPage);

/* GET register page. */
router.get('/register', DisplayRegisterPage);

/* Process the Register request */
router.post('/register', ProcessRegisterPage);
  
/* Process the logout request */
router.get('/logout', ProcessLogoutPage);

export default router;