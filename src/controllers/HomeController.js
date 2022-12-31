// render home page 
const renderHomepage = (req, res) => {
    res.render('../src/views/home')
}

const renderHelpPage = (req, res) => {
    res.render('../src/views/help')
}

const renderAboutPage = (req, res) => {
    res.render('../src/views/about')
}

module.exports = {renderHomepage, renderHelpPage, renderAboutPage}