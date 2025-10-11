import React from "react";

export default function SearchBar({searchTerm, handleInput, placeholder, ...props} : {searchTerm: string, handleInput: (input: string) => void, placeholder?: string} & React.HTMLAttributes<HTMLInputElement>) {
    
    return (
        <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleInput(e.target.value)}
            className="px-4 py-2 text-white bg-navy-blue/[0.8] rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-bright-buzz"
            placeholder={placeholder}
            {...props}
        />
    );

}