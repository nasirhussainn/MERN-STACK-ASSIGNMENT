import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect("home");
});

router.get('/home', (req, res) => {
  res.render("home",{
    weather:false
  });
});

export default router