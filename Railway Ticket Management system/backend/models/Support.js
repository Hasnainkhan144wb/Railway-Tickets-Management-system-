const mongoose =
    require("mongoose");

const supportSchema =
    new mongoose.Schema(

        {

            // PASSENGER

            user: {

                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "User",

                required: true,
            },


            // SUBJECT

            subject: {

                type: String,

                required: true,
            },


            // MESSAGE

            message: {

                type: String,

                required: true,
            },


            // STAFF FEEDBACK

            feedback: {

                type: String,

                default: "",
            },


            // STATUS

            status: {

                type: String,

                enum: [
                    "pending",
                    "resolved",
                ],

                default: "pending",
            },

        },

        {
            timestamps: true,
        }

    );

module.exports =
    mongoose.model(
        "Support",
        supportSchema
    );