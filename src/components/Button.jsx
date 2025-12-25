export default function Button({ children, variant = 'primary', ...props }) {
    const base = "px-4 py-2 rounded font-medium";
    const variants = {
        primary: "bg-blue-500 text-white hover:bg-blue-600",
        secondary: "bg-gray-500 text-white hover:bg-gray-600",
        danger: "bg-red-500 text-white hover:bg-red-600",
    };

    return (
        <button className={`${base} ${variants[variant]}`} {...props}>
            {children}
        </button>
    );
}