const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center min-h-[60vh] bg-blue-50/50 transition-all duration-300">
            <div className="relative w-16 h-16">
                {/* ভেতরের সফট সার্কেল */}
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
                {/* ঘূর্ণায়মান রাজকীয় বেগুনি বার */}
                <div className="absolute inset-0 rounded-full border-4 border-t-purple-800 animate-spin"></div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
