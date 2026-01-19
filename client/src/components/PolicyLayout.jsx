import React from 'react';

const PolicyLayout = ({ title, children }) => {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-4xl mx-auto my-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">{title}</h1>
            <div className="prose prose-blue max-w-none text-gray-600">
                {children}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-500">
                <p>This policy is effective as of {new Date().getFullYear()}.</p>
                <p className="mt-2 font-semibold text-gray-700">Legal Entity Name: Dorankula Mukteshwara Reddy</p>
            </div>
        </div>
    );
};

export default PolicyLayout;
