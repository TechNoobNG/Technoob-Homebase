import React, {useEffect, useRef, useState} from 'react';
import {filtersearch, SearchIcon} from '../../../../data/assets';
import Button from '../../../../utility/button';
import Loader from '../../../../utility/Loader';
import Card from '../../../../utility/Card';

import Filter from '../../../../components/Filter';
import serverApi from '../../../../utility/server';
import {fetchFilteredData, fetchFirstData} from '../../../../utility/filterGather';
import FilterComponent from '../../../../Modals/FilterModal';

const Page1 = () => {

    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [box1, setBox1] = useState([]);
    const [reset, setReset] = useState(false);
    const [filter, setFilter] = useState(false);
    const [passedOptions, setpassedOptions] = useState({})
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected] = useState('');
    const [options, setOptions] = useState([]);
    const [pagination, setPagination] = useState({});
    const itemsPerPage = 10;
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const isInitialRender = useRef(true);

    const openFilterModal = () => {
        setIsFilterModalOpen(true);
    };
    const closeFilterModal = () => {
        setIsFilterModalOpen(false);
    };

    const handleBox1Change = (e) => {
        e.preventDefault();
        const newValue = e.currentTarget.value.trim();
        const updatedSelectedValues = box1.includes(newValue)
            ? box1.filter((val) => val !== newValue)
            : [...box1, newValue];
        setBox1(updatedSelectedValues);

        if (updatedSelectedValues.length === 0) {
            setReset(true);
        }
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const params = {
                name: searchTerm,
                limit: itemsPerPage,
            };
            const response = await serverApi.get('resources/all', {params});
            if (response.status === 200) {
                const responseData = response.data?.data?.resources;
                setResources(responseData);
            } else {
                alert('No result found');
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchFirstData('/resources/all', setResources, null, false, 'resources', setPagination)
            .then((_r) => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }
        const params = {};
        if (box1.length > 0 && !loading){
            params[passedOptions.name] = box1.join(',');
            fetchFilteredData(params, "/resources/all", setResources, 'resources', setPagination).then(_r => {
            })
        }

        if(reset){
            fetchFirstData("/resources/all", setResources, setOptions, false, "resources", setPagination)
                .then(_r => {
                    setLoading(false);
                });
        }
    }, [filter, reset]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleFilter = () => {
        setFilter(true);
    };

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }
        setLoading(true);
        const params = {
            page: currentPage,
        }

        fetchFirstData('/resources/all', setResources, setOptions, false, 'resources', setPagination, params)
            .then((_r) => {
                setLoading(false);
                setReset(false);
            });

    }, [currentPage]);

    const displayedResources = resources

    return (
        <div
            className="flex flex-col w-full justify-start items-center sm:justify-center sm:items-center px-5 sm:px-0 pt-6 md:pt-16 relative">
            <div className='mb-5 sm:mb-[3rem] w-[360px] h-[77px]'>
                <header className='uni text-center md:text-6xl text-3xl font-bold md:py-3 py-10'>
                    <span className=' text-tblue'>RESOURCES</span>
                </header>
            </div>
            <div className='w-full flex justify-center items-start md:justify-center md:items-center mb-[3rem]'>
                <form onSubmit={handleClick}
                      className=' w-[95%] flex flex-col sm:flex-row justify-start md:justify-center items-center gap-6 '>
                    <div
                        className='flex justify-start items-center border border-[#BDBDBD] sm:w-[80%] h-[54px] rounded-lg bg-transparent pl-7 '>
                        <img src={SearchIcon} alt="icon" className='h-5 w-5'/>
                        <input
                            type="text"
                            placeholder='Search by Title'
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='placeholder:italic placeholder:text-slate-400 focus:outline-none text-base w-[280px] h-[100%] p-3 mr-2 focus:border-none focus:ring-[0] '/>
                        <img
                            src={filtersearch}
                            alt="icon"
                            onClick={openFilterModal}
                            className='sm:hidden block mr-2 w-6 h-6'/>

                    </div>

                    <div>
                        <Button name={'Search'} handleClick={handleClick}/>
                    </div>
                </form>

            </div>


            <div className=' flex md:gap-[1rem] h-[30rem] md:h-[35rem] md:justify-between w-[95%] md:ml-12 '>
                <div className='hidden sm:hidden xl:block md:flex-[0.4] h-[35rem] p-4  shadow-md'>
                    <Filter passedOptions={passedOptions} setpassedOptions={setpassedOptions} options={options}
                            selected={selected} setSelected={setSelected} handleBox1Change={handleBox1Change}
                            box1={box1}/>
                </div>
                <div className=' w-full sm:min-h-[600px] md:flex-[1.5] md:pl-4 relative overflow-hidden'>
                    {/* {resources ? <h1 className='text-xs md:text-xl text-[#3A3A3A] font-semibold mb-3 '><span
                            className='text-[#5E7CE8]'>{pagination.total}</span> RESULTS</h1> :
                        <h1 className='text-2xl text-[#3A3A3A] font-semibold'><span
                            className='text-[#5E7CE8]'>ALL</span> RESULTS</h1>
                    } */}
                    <div className='border-b-[0.5px] border-[#C2C7D6] mb-[1rem] w-[95%] '/>
                    <div className='flex-col flex items-start mb-[4rem] relative overflow-x-auto w-full h-screen gap-5'>
                        <div className="flex mb-16 w-full h-full">
                            <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {
                                    displayedResources && displayedResources.length && displayedResources.map((feeds, i) => (
                                        <Card
                                            key={i}
                                            titleText={feeds.name}
                                            photo={feeds.image_placeholder}
                                            pText={feeds.description}
                                            subTitleText={feeds.type}
                                            link={feeds.file || feeds.url}
                                        />
                                    ))}
                                {
                                    !displayedResources.length && (

                                        <div className='flex w-full justify-center items-start  '>

                                            {loading ? <Loader/> : (
                                                <div className='flex flex-col justify-center items-center gap-4'>
                                                    <h1 className='text-base text-center md:text-3xl text-black font-semibold'>Something
                                                        went wrong, <br className='block md:hidden'/> Please try again...
                                                    </h1>
                                                    {/* <span onClick={handleClick} className='underline text-cyan-600 text-[14px] cursor-pointer'>Retry...</span> */}

                                                </div>

                                            )}

                                        </div>

                                    )
                                }



                            </div>
                        </div>
                    </div>

                </div>
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-20 mb-10">
                {resources.length > 0 && (
                    <div className="flex space-x-2">
                        {Array.from({length: Math.ceil(pagination.total / pagination.limit)}).map((_, index) => (
                            <button
                                key={index}
                                className={`px-2 py-1 rounded ${
                                    pagination.page === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                                }`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>


            <FilterComponent
                isOpen={isFilterModalOpen}
                onRequestClose={closeFilterModal}
                passedOptions={passedOptions}
                setpassedOptions={setpassedOptions}
                options={options}
                selected={selected}
                setSelected={setSelected}
                handleBox1Change={handleBox1Change}
                box1={box1}
                closeFilterModal={closeFilterModal}
                setFilter={handleFilter}
            />
        </div>
    );
};

export default Page1;
