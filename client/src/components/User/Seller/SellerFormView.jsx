import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const SellerFormView = ({ applicantData }) => {
    const {
        name,
        businessName,
        ownerName,
        tradeName,
        nationalId,
        licenseNo,
        issueDate,
        expiryDate,
        email,
        phone,
        description,
        photo,
    } = applicantData || {};

    return (
        <div className="flex items-center justify-center min-h-[80vh] bg-gray-100 py-32 px-8">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
                <div className="bg-blue-600 text-white p-4 rounded-lg mb-6">
                    <h1 className="text-2xl font-bold text-center mb-2">
                        Submitted Application Details
                    </h1>
                    <p className="text-center mb-0">
                        Please review your details below.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[
                        { label: 'Name', value: name },
                        { label: 'Business Name', value: businessName },
                        { label: "Owner's Name", value: ownerName },
                        { label: 'Trade Name', value: tradeName },
                        { label: 'National ID/Passport No.', value: nationalId },
                        { label: 'License No.', value: licenseNo },
                        { label: 'Issue Date', value: issueDate },
                        { label: 'Expiry Date', value: expiryDate },
                        { label: 'Email ID', value: email },
                        { label: 'Phone No.', value: phone },
                        { label: 'Description', value: description },
                    ].map((item, index) => (
                        <div key={index} className="mb-4">
                            <label className="block text-gray-700 mb-1 font-medium">{item.label}:</label>
                            <div className="bg-gray-100 px-4 py-2 rounded-lg">{item.value || "Not provided"}</div>
                        </div>
                    ))}
                </div>

                {photo && (
                    <div className="flex justify-center mt-6">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                            <img
                                src={photo}
                                alt="Captured Photo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-between mt-6">
                    <Link to="/edit-form">
                        <button
                            className="px-6 py-2 border border-gray-400 rounded-lg text-gray-600 hover:bg-gray-200"
                        >
                            EDIT
                        </button>
                    </Link>
                    <Link to="/seller">
                        <button
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            BACK TO HOME
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

SellerFormView.propTypes = {
    applicantData: PropTypes.shape({
        name: PropTypes.string,
        businessName: PropTypes.string,
        ownerName: PropTypes.string,
        tradeName: PropTypes.string,
        nationalId: PropTypes.string,
        licenseNo: PropTypes.string,
        issueDate: PropTypes.string,
        expiryDate: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.string,
        description: PropTypes.string,
        photo: PropTypes.string,
    }),
};

export default SellerFormView;
