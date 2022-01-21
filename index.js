const express = require('express');
const app = express();
const port = 3000;

const users = [];
const messages = [];

app.use(
    express.urlencoded({
        extended: true,
    }),
);

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello world');
});

// users
app.post('/api/users', (req, res) => {
    const body = req.body;

    const existedUser = users.some((user) => user._id === body._id);

    if (!existedUser) {
        users.push(body);
    }

    res.send({
        message: 'Join success.',
        data: users,
    });
});

// messages
app.get('/api/messages', (req, res) => {
    const responseMessages = messages.map((message) => {
        return {
            ...message,
            user: users.find((user) => user._id === message.sender_id),
        };
    });

    res.send({
        message: 'Fetch data success.',
        data: responseMessages,
    });
});

app.post('/api/messages', (req, res) => {
    const body = req.body;

    const userIndex = users.findIndex((user) => user._id === body.sender_id);
    if (userIndex === -1) {
        res.status(404).send({
            message: 'User not found.',
        });
    }

    messages.push(body);

    res.status(201).send({
        message: 'Message was created.',
        data: {
            ...body,
            user: users[userIndex],
        },
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
