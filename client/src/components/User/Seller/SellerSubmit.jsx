import { Link } from "react-router-dom";

const SellerSubmit = () => {
    return (
        <div className="flex items-center justify-center min-h-[80vh] bg-gray-100 py-32 px-8 flex-col">
            <p className="text-center mb-0">
                Your application has been submitted successfully 
                and is currently under review. We will notify you once 
                it has been processed. 
            </p>
            <div className="flex justify-between">
                <Link to='/seller-form-view'>
                    <button
                    type="submit"
                    className="m-10 px-6 py-2 bg-green-900 text-white rounded-lg hover:bg-green-700"
                    >
                    View Your Application
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default SellerSubmit;