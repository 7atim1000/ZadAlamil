const CreateAccount = () => {
  return (
    <div className="bg-[#f6f6f6] m-10">
      <div className="w-full mx-auto ">
        <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
        <p className="text-gray-600 mt-4">
          Creating your Zad Alamil seller account is a quick process, taking less than 10 minutes, and kindly fill the application form.
          Follow the checklist to ensure a seamless account creation experience. By having your documents ready, you can streamline the
          account creation process and get started on Zad Alamil as an online seller in no time.
        </p>
        <div className="bg-white shadow-md shadow-light-blue-400 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Categories to sell through Zad Alamil
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-gray-700">
            <p>Mobiles & Tablets</p>
            <p>Wearables & Smart Watches</p>
            <p>Personal Care</p>
            <p>Tv & Audio</p>
            <p>Appliances</p>
            <p>Computing</p>
            <p>Gaming</p>
            <p>Accessories</p>
            <p>Routers</p>
            <p>Photography</p>
            <p>Other Categories</p>
          </div>
        </div>
        <p className="text-gray-600 mt-4">
          In a simple way you can create your new category!
        </p>
      </div>
    </div>
  )
}

export default CreateAccount;
