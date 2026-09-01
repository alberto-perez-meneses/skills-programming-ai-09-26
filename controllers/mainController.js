const reverseString = require('../lib/string').reverseString;

const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
];

function getHome(req, res) {
    res.send('Hello World!');
}

function getUserById(req, res) {
    const userId = req.params.id;
    const user = users.find(user => user.id === parseInt(userId, 10));

    if (!user) {
        res.status(404).send({ error: "User not found" });
        return;
    }

    res.send(user);
}

function reverseUserString(req, res) {
    const str = req.params.str;
    const reversed = reverseString(str);

    res.send({ original: str, reversed: reversed });
}

module.exports = {
    getHome,
    getUserById,
    reverseUserString
};
