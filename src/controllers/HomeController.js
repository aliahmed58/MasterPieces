// render home page 
const renderHomepage = (req, res) => {
    res.render('../src/views/home')
}

const renderHelpPage = (req, res) => {
    res.render('../src/views/help')
}

module.exports = {renderHomepage, renderHelpPage}