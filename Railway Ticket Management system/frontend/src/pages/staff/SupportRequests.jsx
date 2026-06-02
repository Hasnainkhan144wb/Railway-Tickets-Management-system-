import {
    useEffect,
    useState,
} from "react";

import axios from "axios";

import DashboardLayout from "../../components/DashboardLayout";


const SupportRequests = () => {

    const [supports, setSupports] =
        useState([]);


    // MESSAGE LINE BREAK FUNCTION

    const formatMessage = (text) => {

        return text
            ?.split(" ")
            .reduce((acc, word, index) => {

                return acc +
                    word +
                    (
                        (index + 1) % 5 === 0
                            ? "\n"
                            : " "
                    );

            }, "");
    };


    // FETCH SUPPORTS

    const fetchSupports =
        async () => {

            try {

                const res =
                    await axios.get(
                        "http://localhost:5000/api/supports"
                    );

                setSupports(
                    res.data
                );

            } catch (error) {

                console.log(error);
            }
        };


    useEffect(() => {

        fetchSupports();

    }, []);


    // RESOLVE REQUEST

    const resolveHandler =
        async (id) => {

            try {

                await axios.put(
                    `http://localhost:5000/api/supports/resolve/${id}`
                );

                alert(
                    "Request Resolved"
                );

                fetchSupports();

            } catch (error) {

                console.log(error);
            }
        };


    return (

        <DashboardLayout>

            <div className="mb-8">

                <h1 className="text-4xl font-bold text-gray-800">
                    Passenger Support Requests
                </h1>

                <p className="text-gray-500 mt-2">
                    Manage and resolve passenger issues.
                </p>

            </div>


            <div className="bg-white p-6 rounded-xl shadow border">

                <div className="overflow-auto max-h-[500px]">

                    <table className="w-full text-left border-collapse">

                        <thead>

                            <tr className="bg-gray-100">

                                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                    Passenger
                                </th>

                                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                    Subject
                                </th>

                                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                    Message
                                </th>

                                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                    Status
                                </th>

                                <th className="p-3 sticky top-0 bg-gray-100 z-10">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {supports.map(
                                (support) => (

                                    <tr
                                        key={support._id}
                                        className="border-b hover:bg-gray-50"
                                    >

                                        <td className="p-3">

                                            {
                                                support.user?.name
                                            }

                                        </td>

                                        <td className="p-3">

                                            {
                                                support.subject
                                            }

                                        </td>

                                        {/* MESSAGE */}

                                        <td className="p-3 whitespace-pre-wrap break-words">

                                            {
                                                formatMessage(
                                                    support.message
                                                )
                                            }

                                        </td>

                                        <td className="p-3">

                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold
                        ${support.status ===
                                                        "resolved"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >

                                                {support.status}

                                            </span>

                                        </td>

                                        <td className="p-3">

                                            {support.status ===
                                                "pending" && (

                                                    <button
                                                        onClick={() =>
                                                            resolveHandler(
                                                                support._id
                                                            )
                                                        }
                                                        className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg"
                                                    >
                                                        Resolve
                                                    </button>

                                                )}

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </DashboardLayout>
    );
};

export default SupportRequests;