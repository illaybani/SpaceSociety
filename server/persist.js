const MongoClient = require('mongodb').MongoClient;
const fs = require('fs-extra');

const MONGO_URI = "mongodb+srv://illay789:Ii!12345@spacesocietycluster.ul9ul4o.mongodb.net/?retryWrites=true&w=majority";

function formatDateToNiceString(dateString) {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

async function fetchAndSaveCollections() {
    let client;

    try {
        client = await MongoClient.connect(MONGO_URI, { useUnifiedTopology: true });
        const db = client.db("test");

        let usersData = await db.collection("users").find({}, { projection: { __v: 0 } }).toArray();

        usersData = usersData.map(user => {
            if (user.lastLoginTime) {
                user.lastLoginTime = formatDateToNiceString(user.lastLoginTime);
            }
            if (user.createdAt) {
                user.createdAt = formatDateToNiceString(user.createdAt);
            }
            return user;
        });

        const cardsData = await db.collection("cards").find({}, { projection: { __v: 0, createdAt: 0, index: 0 } }).toArray();

        // Write users data to a file
        await fs.writeJSON('./data/users.json', usersData, { spaces: 2 });

        // Write cards data to a file
        await fs.writeJSON('./data/cards.json', cardsData, { spaces: 2 });

    } catch (err) {
        console.error("Error fetching and saving collections:", err);
    } finally {
        if (client) client.close();
    }
}

module.exports = {
    fetchAndSaveCollections
};
