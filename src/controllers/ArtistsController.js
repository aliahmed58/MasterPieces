// show all artists in a list
const listAllArtists = (req, res) => {
    res.render('../src/views/artists/AllArtists')   
}

// generate report for the given artist id
const generateReport = (req, res) => {
    res.render('../src/views/artists/ArtistReport')
}

// render form for new artist
const renderForm = (req, res) => {
    res.render('../src/views/artists/NewArtist')
}

module.exports = {listAllArtists, generateReport, renderForm}
