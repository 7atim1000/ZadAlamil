const Loader = () => {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="flex space-x-3">
          <div className="w-4 h-4 bg-red-900 rounded-full animate-bubble1"></div>
          <div className="w-4 h-4 bg-black rounded-full animate-bubble2"></div>
          <div className="w-4 h-4 bg-red-900 rounded-full animate-bubble3"></div>
        </div>
      </div>
    );
  };
  
  export default Loader;
  