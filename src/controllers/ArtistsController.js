// show all artists in a list
const listAllArtists = (req, res) => {
    res.render('../src/views/artists/AllArtists')   
}

// generate report for the given artist id
const generateReport = (req, res) => {
    res.render('../src/views/artists/ArtistReport')
}

module.exports = {listAllArtists, generateReport}
