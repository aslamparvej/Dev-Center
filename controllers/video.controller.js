function getVideo(req, res) {
    res.render('user/videos/videos');
}

module.exports = {
    getVideo: getVideo,
  }