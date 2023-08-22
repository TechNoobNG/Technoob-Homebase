

const People = ({ people }) => {
  return (
    <>
        {people?.data.map((person) => (
            <div id={person._id} key={person._id}
                 className=' text-center md:w-[480px] w-40 px-2 md:h-[330px] h-40 shadow-md rounded-2xl lg:px-10 mx-4 lg:py-10 py-4 mt-2 justify-between'>
                <img src={person.image} alt=" Member img" className=' min-h-[100px] min-w-[140px] ' />
                <div className="md:pt-20">
                    <h3 className=' md:text-2xl text-sm font-semibold'>{`${person.last_name} ${person.first_name}`}</h3>
                    <p className=' md:text-xl text-[7px] '>{person.designation} </p>
                </div>
            </div>
        )) }
    </>
  )
}

export default People