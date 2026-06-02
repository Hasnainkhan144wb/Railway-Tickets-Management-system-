const Support =
    require("../models/Support");


// CREATE SUPPORT REQUEST

const createSupport =
    async (req, res) => {

        try {

            const {
                user,
                subject,
                message,
            } = req.body;

            const support =
                await Support.create({

                    user,

                    subject,

                    message,

                });

            res.status(201).json({

                message:
                    "Support Request Submitted",

                support,

            });

        } catch (error) {

            res.status(500).json({
                message: error.message,
            });
        }
    };


// GET ALL SUPPORT REQUESTS

const getSupports =
    async (req, res) => {

        try {

            const supports =
                await Support.find()

                    .populate("user");

            res.json(supports);

        } catch (error) {

            res.status(500).json({
                message: error.message,
            });
        }
    };


// RESOLVE SUPPORT REQUEST
const resolveSupport =
    async (req, res) => {

        try {

            const {
                feedback,
            } = req.body;

            const support =
                await Support.findById(
                    req.params.id
                );

            if (!support) {

                return res.status(404).json({

                    message:
                        "Support request not found",

                });
            }

            // UPDATE STATUS

            support.status =
                "resolved";

            // SAVE STAFF FEEDBACK

            support.feedback =
                feedback;

            await support.save();

            res.json({

                message:
                    "Support Request Resolved",

            });

        } catch (error) {

            res.status(500).json({
                message: error.message,
            });
        }
    };

module.exports = {

    createSupport,

    getSupports,

    resolveSupport,

};