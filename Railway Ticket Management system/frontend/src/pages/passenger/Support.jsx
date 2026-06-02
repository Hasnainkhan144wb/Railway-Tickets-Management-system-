import {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import DashboardLayout from "../../components/DashboardLayout";


const Support = () => {

    const [subject,
        setSubject] =
        useState("");

    const [message,
        setMessage] =
        useState("");

    const [supports,
        setSupports] =
        useState([]);


    const user = JSON.parse(
        localStorage.getItem("user")
    );


    // FETCH SUPPORTS

    const fetchSupports =
        async () => {

            try {

                const res =
                    await axios.get(
                        "http://localhost:5000/api/supports"
                    );

                const userSupports =
                    res.data.filter(
                        (item) =>
                            item.user?._id?.toString() ===
                            user.id?.toString()
                    );

                setSupports(
                    [...userSupports]
                );

            } catch (error) {

                console.log(error);
            }
        };

    useEffect(() => {

        fetchSupports();

    }, []);


    // SUBMIT REQUEST

    const submitHandler =
        async (e) => {

            e.preventDefault();

            try {

                await axios.post(
                    "http://localhost:5000/api/supports",
                    {

                        user: user.id,

                        subject,

                        message,

                    }
                );

                alert(
                    "Complaint Submitted Successfully"
                );

                setSubject("");

                setMessage("");

                fetchSupports();

            } catch (error) {

                console.log(error);
            }
        };


    return (

        <DashboardLayout>

            <div className="grid lg:grid-cols-2 gap-8 items-stretch">

                {/* SUPPORT FORM */}

                <div className="bg-white p-8 rounded-2xl shadow-lg border h-[85vh] flex flex-col">

                    <div>

                        <h1 className="text-4xl font-bold mb-3 text-gray-800">
                            Passenger Support
                        </h1>

                        <p className="text-gray-500 mb-8">
                            Submit your complaint or issue.
                        </p>

                    </div>


                    <form
                        onSubmit={submitHandler}
                        className="space-y-6 flex-1 flex flex-col"
                    >

                        {/* SUBJECT */}

                        <div>

                            <label className="block mb-2 font-semibold text-gray-700">
                                Subject
                            </label>

                            <input
                                type="text"
                                value={subject}
                                onChange={(e) =>
                                    setSubject(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter complaint subject"
                                className="w-full border border-gray-300 p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-700"
                                required
                            />

                        </div>


                        {/* MESSAGE */}

                        <div className="flex-1 flex flex-col">

                            <label className="block mb-2 font-semibold text-gray-700">
                                Complaint
                            </label>

                            <textarea
                                value={message}
                                onChange={(e) =>
                                    setMessage(
                                        e.target.value
                                    )
                                }
                                placeholder="Write your complaint here..."
                                className="w-full border border-gray-300 p-4 rounded-xl resize-none outline-none focus:ring-2 focus:ring-green-700 flex-1 min-h-[220px] max-h-[220px] overflow-y-auto"
                                required
                            />

                        </div>


                        {/* BUTTON */}

                        <button
                            type="submit"
                            className="bg-green-900 hover:bg-green-800 transition text-white px-6 py-3 rounded-xl font-semibold"
                        >
                            Submit Complaint
                        </button>

                    </form>

                </div>


                {/* MY COMPLAINTS */}

                <div className="bg-white p-8 rounded-2xl shadow-lg border h-[85vh] flex flex-col">

                    <h2 className="text-3xl font-bold mb-6 text-gray-800">
                        My Complaints
                    </h2>


                    {/* SCROLLABLE AREA */}

                    <div className="space-y-5 overflow-y-auto pr-2 flex-1">

                        {supports.length > 0 ? (

                            supports.map(
                                (support) => (

                                    <div
                                        key={support._id}
                                        className="border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition bg-gray-50"
                                    >

                                        {/* SUBJECT */}

                                        <h3 className="text-xl font-bold text-green-900 break-words">

                                            {
                                                support.subject
                                            }

                                        </h3>


                                        {/* MESSAGE */}

                                        <p className="text-gray-700 mt-3 break-words whitespace-pre-wrap leading-relaxed">

                                            {
                                                support.message
                                            }

                                        </p>


                                        {/* STATUS */}

                                        <div className="mt-5">

                                            <span
                                                className={`px-4 py-2 rounded-full text-sm font-semibold
                                                ${support.status ===
                                                        "resolved"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >

                                                {
                                                    support.status
                                                }

                                            </span>

                                        </div>


                                        {/* FEEDBACK */}

                                        <div className="mt-5 bg-white p-4 rounded-xl border">

                                            <h4 className="font-bold text-gray-800 mb-2">
                                                Staff Feedback
                                            </h4>

                                            <p className="text-gray-600 break-words whitespace-pre-wrap">

                                                {
                                                    support.feedback
                                                        ? support.feedback
                                                        : "Waiting for staff response..."
                                                }

                                            </p>

                                        </div>

                                    </div>

                                )
                            )

                        ) : (

                            <div className="flex items-center justify-center h-full text-gray-500 text-lg">

                                No complaints submitted yet.

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
};

export default Support;