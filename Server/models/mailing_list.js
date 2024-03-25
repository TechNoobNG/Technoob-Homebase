const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MailingListGrouping = require("./mailing_list_grouping");

const mailing_list = new Schema({
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        trim: true,
    },
    groupId: {
        type: String,
        trim: true,
        default: "technoob-workspace:web_contact_us"
    },
    username: {
        type: String,
        trim: true
    },
    firstname: {
        type: String,
        trim: true,
    },
    lastname: {
        type: String,
        trim: true
    }
},{
    timestamps: true
});

mailing_list.post('insertMany', async function(doc) {
    try {
        const groupIds = doc.map((list) => {
            return list.groupId
        })
        const uniqueGroupIds = [...new Set(groupIds)];
        const insertionObject = uniqueGroupIds.map((groupId) => {
            return {
                groupName: groupId.split(":")[1],
                owner: groupId.split(":")[0],
                id: groupId
            }
        })
        await MailingListGrouping.insertMany(insertionObject);
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.groupName === 1) {
            console.log(`Group with name '${doc.groupId}' already exists.`);
        } else {
            console.error("Error creating corresponding groupId:", error);
        }
    }
});

module.exports = mongoose.model('Mailing_list', mailing_list);
