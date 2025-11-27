import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../Utils/BaseUrl.js";
import { toast } from "react-hot-toast";

const SellerForm = () => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [isCameraActive, setIsCameraActive] = useState(false);
    const [photoCaptured, setPhotoCaptured] = useState(null); 
    const [stream, setStream] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        ownerName: "",
        tradeName: "",
        idNumber: "",
        licenseNumber: "",
        issuedDate: "",
        expiryDate: "",
        email: "",
        phone: "",
        address: "",
        description: "",
        licenseDocument: null,
        idDocument: null,
        livePhoto: null
    });

    const [formErrors, setFormErrors] = useState({
        name: "",
        ownerName: "",
        tradeName: "",
        idNumber: "",
        licenseNumber: "",
        issuedDate: "",
        expiryDate: "",
        email: "",
        phone: "",
        address: "",
        description: "",
        licenseDocument: "",
        idDocument: "",
        livePhoto: ""
    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            // Handle phone number validation during typing
            if (name === "phone") {
                if (value.length <= 10) {
                    setFormData({ ...formData, [name]: value });
                    // Clear error if phone length is valid
                    if (value.length === 10) {
                        setFormErrors((prevErrors) => ({ ...prevErrors, phone: "" }));
                    }
                } else {
                    return; // Prevent more than 10 digits
                }
            } else {
                setFormData({ ...formData, [name]: value });
            }
        }
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;
    
        // General field validation
        Object.keys(formData).forEach((key) => {
            if (!formData[key] && key !== "licenseDocument" && key !== "idDocument" && key !== "livePhoto") {
                errors[key] = `${key.replace(/([A-Z])/g, ' $1').toUpperCase()} is required.`;
                isValid = false;
            }
        });
    
        // Validate license document, ID document, and live photo
        if (!formData.licenseDocument) {
            errors.licenseDocument = "License document is required.";
            isValid = false;
        }
        if (!formData.idDocument) {
            errors.idDocument = "ID document is required.";
            isValid = false;
        }
        if (!formData.livePhoto) {
            errors.livePhoto = "Live photo is required.";
            isValid = false;
        }
    
        // Validate issued and expiry dates
        if (formData.issuedDate && formData.expiryDate) {
            const issuedDate = new Date(formData.issuedDate);
            const expiryDate = new Date(formData.expiryDate);
            const currentDate = new Date();
    
            if (issuedDate > currentDate) {
                errors.issuedDate = "Issued date should not be in Future.";
                isValid = false;
            }
            if (expiryDate < issuedDate) {
                errors.expiryDate = "Expiry date should not be before the issued date.";
                isValid = false;
            }

            if(expiryDate < currentDate){
                errors.expiryDate = "Expired license/passport";
                isValid = false;
            }
        }
    
        // Validate license number (assuming it should be numeric)
        if (formData.licenseNumber && !/^\d+$/.test(formData.licenseNumber)) {
            errors.licenseNumber = "License number must be numeric.";
            isValid = false;
        }
    
        // Validate ID number (assuming it should be numeric)
        if (formData.idNumber && !/^\d+$/.test(formData.idNumber)) {
            errors.idNumber = "ID number must be numeric.";
            isValid = false;
        }
    
        // Validate mobile number (assuming it should be exactly 10 digits)
        if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
            errors.phone = "Phone number must be 10 digits.";
            isValid = false;
        }

     // Validate email format with stricter validation
     if (formData.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net|edu|gov|int|co|io|[a-zA-Z]{2,})$/.test(formData.email)) {
        errors.email = "Please enter a valid email address.";
        isValid = false;
    }
        if(!isValid){
            toast.error("try again!!")
        }
        setFormErrors(errors);
        return isValid;
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        console.log("Form Data Submitted:::::", formData);

        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            const response = await axios.post("/api/user/submit-seller-application", formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log(response, "this is the signup response..............>>>>");
            if (response.status === 201) {
                toast.success("Application sent successfully");
                navigate("/seller-submit");
            }
        } catch (error) {
            setLoading(false);
            if (error.response) {
                const errorMessage = error.response.data.message;
                toast.error(errorMessage);
            } else {
                toast.error("An unexpected error occurred.");
            }
        }
    };

    const handleStartCamera = async () => {
        try {
            const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(videoStream);
            setIsCameraActive(true);
            if (videoRef.current) {
                videoRef.current.srcObject = videoStream;
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
        }
    };

    const handleStopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        setStream(null);
        setIsCameraActive(false);
    };

    const handleTakeSnapshot = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            const snapshot = canvas.toDataURL("image/png");
            setPhotoCaptured(snapshot);

            const base64Data = snapshot.split(",")[1];
            const binary = atob(base64Data);
            const array = [];
            for (let i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            const blob = new Blob([new Uint8Array(array)], { type: "image/png" });

            // Create a File object
            const livePhotoFile = new File([blob], "livePhoto.png", { type: "image/png" });

            setFormData((prevData) => ({
                ...prevData,
                livePhoto: livePhotoFile,
            }));

            handleStopCamera();
        }
    };

    const handleRetakePhoto = () => {
        setPhotoCaptured(null);
        handleStartCamera();
    };

    useEffect(() => {
        return () => {
            if (isCameraActive) {
                handleStopCamera();
            }
        };
    }, [isCameraActive]);

    return (
        <div className="flex items-center justify-center min-h-[80vh] bg-gray-100 py-32 px-8">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
                <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
                    <h1 className="text-2xl font-bold text-center mb-2">
                        Want to become a seller with Zad Alamil?
                    </h1>
                    <p className="text-center mb-0">Take a few minutes to fill this form</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {[
                            { label: "Name", name: "name" },
                            { label: "Owner's Name", name: "ownerName" },
                            { label: "Trade Name", name: "tradeName" },
                            { label: "National ID/Passport No.", name: "idNumber" },
                            { label: "License No.", name: "licenseNumber" },
                            { label: "Issued Date", name: "issuedDate", type: "date" },
                            { label: "Expiry Date", name: "expiryDate", type: "date" },
                            { label: "Email ID", name: "email" },
                            { label: "Phone No.", name: "phone" },
                            { label: "Address", name: "address" },
                            { label: "Description", name: "description" },
                        ].map(({ label, name, type = "text" }, index) => (
                            <div key={index} className="mb-4">
                                <label className="block text-gray-700 mb-2">
                                    {label}:<strong className="text-red-900">*</strong>
                                </label>
                                <input
                                    type={type}
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                                    
                                />
                                {formErrors[name] && (
                                    <p className="text-red-600 text-sm mt-1">{formErrors[name]}</p>
                                )}
                            </div>
                        ))}

                        {[
                            { label: "Upload License Document", name: "licenseDocument" },
                            { label: "Upload National ID/Passport Document", name: "idDocument" },
                        ].map(({ label, name }, index) => (
                            <div key={index} className="mb-4 col-span-2">
                                <label className="block text-gray-700 mb-2">
                                    {label}:<strong className="text-red-900">*</strong>
                                </label>
                                <input
                                    type="file"
                                    name={name}
                                    accept=".pdf,.jpg,.png"
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                                   
                                />
                                {formErrors[name] && (
                                    <p className="text-red-600 text-sm mt-1">{formErrors[name]}</p>
                                )}
                            </div>
                        ))}

                        {/* Camera Section */}
                        <div className="col-span-2 flex items-center space-x-4 mb-6">
                            <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                                {photoCaptured ? (
                                    <img
                                        src={photoCaptured}
                                        alt="Captured"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        className="w-full h-full object-cover"
                                    ></video>
                                )}
                            </div>
                            <canvas ref={canvasRef} className="hidden"></canvas>

                            <div>
                                {!photoCaptured && (
                                    <button
                                        type="button"
                                        onClick={handleStartCamera}
                                        disabled={isCameraActive}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg"
                                    >
                                        Activate Camera
                                    </button>
                                )}
                                {!photoCaptured && isCameraActive && (
                                    <button
                                        type="button"
                                        onClick={handleTakeSnapshot}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg ml-4"
                                    >
                                        Take Snapshot
                                    </button>
                                )}
                                {photoCaptured && (
                                    <button
                                        type="button"
                                        onClick={handleRetakePhoto}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg ml-4"
                                    >
                                        Retake Picture
                                    </button>
                                )}
                            </div>
                            {formErrors.livePhoto && (
                                <p className="text-red-600 text-sm mt-1">{formErrors.livePhoto}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button
                            type="button"
                            className="px-6 py-2 border border-gray-400 rounded-lg text-gray-600 hover:bg-gray-200"
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "SUBMIT"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SellerForm;
