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
            className="relative w-[160px] sm:w-[260px] h-[300px] sm:h-[370px] sm:mt-10 flex flex-col rounded-2xl shadow-md"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <a className="flex flex-col justify-center items-center h-full w-full sm:w-full sm:h-full">
                <div className="flex flex-col justify-center items-center w-[200px] h-[200px] sm:w-[250px] sm:h-[300px] ">
                    <div className='flex flex-col justify-center  items-center w-[120px] sm:w-[200px] h-[320px] sm:h-[300px] mb-2'>
                        <img src={photo} alt={titleText} className="w-[120px] h-[200px] lg:w-[200px] lg:h-[300px] object-cover p-1 bg-blue-500" />

                    </div>
                    
                    <div className="sm:flex flex-col gap-1 w-[70%]  sm:w-full text-center justify-center items-center">
                        <h1 className="text-xs text-center w-[100%] sm:w-[70%] md:text-sm font-bold truncate">{titleText}</h1>
                        <div className="hidden sm:flex items-center">
                            <span className="rounded-2xl py-1 bg-blue-500 text-white px-2 text-xs">
                                {subTitleText.toUpperCase()}
                            </span>
                        </div>
                    </div>
                    {isHovered && (
                        <div className="absolute w-full h-full flex justify-center items-center">
                            <div className=' w-full h-full bg-gray-400 opacity-30 rounded-2xl'/>
                            <div className="absolute flex flex-col gap-1">
                                <a href={link}>
                                    <button className=" bg-blue-500 text-xs md:text-lg w-[100%] text-white px-2 py-1 rounded">
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
