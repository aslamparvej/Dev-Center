function getAbout(req, res) {
    res.render('user/about/about');
}

module.exports = {
    getAbout: getAbout,
  }