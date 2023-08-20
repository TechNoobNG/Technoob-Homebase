import React from 'react';

const Card = ({photo, titleText, subTitleText, pText, link}) => {
    return (
        <div
            className="w-full sm:w-[230px] h-[90%] sm:h-[320px] sm:mt-10 p-3 flex flex-col justify-start items-center rounded-2xl shadow-md">
            <a href={link} className="flex flex-col w-full h-full justify-start items-center ">
                <div className="flex flex-col justify-center items-center w-full h-full sm:h-[280px] mb-2">
                    <img src={photo} alt={titleText} className="w-[90%] h-[100%] object-contain p-2"/>
                    <div className="sm:flex flex-col gap-2 text-center justify-center items-center">
                        <h1 className="text-xs text-base md:text-xl font-bold">{titleText}</h1>
                        <div className="hidden sm:flex items-center">
                            <span className="rounded-full bg-blue-500 text-white px-2 py-1 text-xs">
                                {subTitleText.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    );
};

export default Card;
