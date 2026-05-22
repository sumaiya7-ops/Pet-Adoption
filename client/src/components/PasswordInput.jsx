import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

const PasswordInput = ({ name = "password", label = "Password" }) => {
    const [show, setShow] = useState(false);
    const [value, setValue] = useState("");

    const getStrength = (pass) => {
        let score = 0;
        if (pass.length >= 6) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[a-z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;

        if (score <= 1) return { text: "Weak ⚠️", color: "bg-red-500", width: "33%" };
        if (score === 2 || score === 3) return { text: "Medium ⚡", color: "bg-amber-500", width: "66%" };
        return { text: "Strong ✨", color: "bg-emerald-600", width: "100%" };
    };

    const strength = getStrength(value);

    return (
        <div className="w-full text-sm">
            <label className="block text-blue-900 font-bold mb-2">
                {label}
            </label>

            <div className="relative">
                <Lock className="absolute left-3.5 top-4 text-purple-900/40 w-4 h-4" />
                <input
                    type={show ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-indigo-100/70 text-purple-900 font-semibold px-4 pl-11 py-3.5 rounded-xl border border-indigo-200 focus:outline-none focus:border-purple-800 focus:ring-2 focus:ring-purple-200 transition placeholder-purple-900/40"
                />

                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3.5 top-3.5 text-purple-900/50 hover:text-purple-900 p-0.5 rounded-lg transition-colors"
                >
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>            
            {value && (
                <div className="mt-2 bg-indigo-50/60 border border-indigo-100 p-2.5 rounded-xl animate-fade-in">
                    <div className="w-full h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ease-out ${strength.color}`}
                            style={{ width: strength.width }}
                        ></div>
                    </div>
                    <p className="text-xs mt-1.5 text-purple-900/70 font-bold">
                        Password Strength: <span className="font-black text-blue-900">{strength.text}</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default PasswordInput;
