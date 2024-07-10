function getBlog(req, res) {
    res.render('user/blogs/blogs');
}

module.exports = {
    getBlog: getBlog,
  }