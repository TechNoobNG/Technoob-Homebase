import React, { useState } from 'react';

const Card = ({ photo, titleText, subTitleText, pText, link, removeItem, id, user }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div
            className="relative w-full sm:w-[230px] h-[120px] sm:h-[320px] sm:mt-10 p-3 flex flex-col justify-start items-center rounded-2xl shadow-md"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <a className="flex flex-col h-full w-full sm:w-full sm:h-[full] justify-start items-center">
                <div className="relative flex flex-col justify-center items-center w-full h-full sm:h-[280px] mb-2">
                    <img src={photo} alt={titleText} className="w-[90%] h-[100%] object-contain p-2" />
                    <div className="sm:flex flex-col gap-2 text-center justify-center items-center">
                        <h1 className="text-xs text-base md:text-xl font-bold">{titleText}</h1>
                        <div className="hidden sm:flex items-center">
                            <span className="rounded-full bg-blue-500 text-white px-2 py-1 text-xs">
                                {subTitleText.toUpperCase()}
                            </span>
                        </div>
                    </div>
                    {isHovered && (
                        <div className="absolute inset-0.5px flex justify-center items-center">
                            <div className="flex flex-col gap-1">
                                <a href={link}>
                                    <button className="bg-blue-500 text-xs md:text-xl w-[100%] text-white px-2 py-1 rounded">
                                        View
                                    </button>
                                </a>
                                {user && user.role === 'admin' && (
                                    <button
                                        className="bg-red-500 text-xs text-white w-[100%] md:text-xl px-2 py-1 rounded"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeItem(id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </a>
        </div>
    );
};

export default Card;
