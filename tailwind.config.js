export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            color: {
                primary: '#6366f1', // indigo-500
                sidebar: '#1e1b4b', // slate-900 + hint of purple
                sidebarHover: '#312e81',
                surface: '#1f2937', // gray-800
                surfaceLight: '#374151', // gray-700
            }
        },
    },
    plugins: [],
}
