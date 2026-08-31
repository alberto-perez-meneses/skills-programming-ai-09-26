const express = require('express')
const app = express()
const port = 3000
const reverseString = require('./lib/string').reverseString;

const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
];

app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.get('/about/:id', (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        res.status(400).send({ error: "Missing id" });
        return;
    }

    const user = users.find(u => u.id === parseInt(userId));

    if (!user) {
        res.status(404).send({ error: "User not found" });
        return;
    }

    res.send(user);
})

app.get('/reverse/:str', (req, res) => {
    const str = req.params.str;
    const reversed = reverseString(str);
    res.send({ original: str, reversed: reversed });
});




if (require.main === module) {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

// Exportamos la app para usarla en los tests
module.exports = app;