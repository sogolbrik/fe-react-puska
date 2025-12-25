export default function Input({ label, ...props }) {
    return (
        <div className="flex flex-col">
            {label && <label className="text-sm font-medium mb-1">{label}</label>}
            <input
                className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                {...props}
            />
        </div>
    );
}