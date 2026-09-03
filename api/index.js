const express = require('express')
const app = express()
const port = 3000
const {
    getHome,
    getUserById,
    reverseUserString,
    reverseUserStringHttp,
    getUserAsync,
    getUserWithRetry
} = require('./controllers/mainController');

app.get('/', getHome)
app.get('/about/:id', getUserById)
app.get('/reverse/:str', reverseUserString)
app.get('/reverse-http/:str', reverseUserStringHttp)
app.get('/async/:id', getUserAsync)
app.get('/retry/:id', getUserWithRetry)




if (require.main === module) {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

// Exportamos la app para usarla en los tests
module.exports = app;