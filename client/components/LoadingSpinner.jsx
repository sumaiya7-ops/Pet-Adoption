const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center min-h-[60vh] bg-slate-950">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-slate-800"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 animate-spin"></div>
            </div>
        </div>
    );
};

export default LoadingSpinner;
