import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile('home.html', { root: './html' });
});


router.get('/home', (req, res) => {
  res.sendFile('home.html', { root: './html' });
});

router.get('/see_country_universities', (req, res) => {
  res.sendFile('countryForm.html', { root: './html' });
});

router.get('/search_university', (req, res) => {
  res.sendFile('universityForm.html', { root: './html' });
});

export default router;
