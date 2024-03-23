import React, {useState} from 'react'

const ActiveTask = ( { task } ) => {
  const [checked, setChecked] = useState(false)
  return (
      <label htmlfor={task.type} className='w-full h-[120px] rounded-[24px] px-7 border-l-[10px] shadow-lg flex items-center justify-between bg-white' style={{borderColor: task.borderColor}}>
          <div className='text-left text-tblackk space-y-2'>
              <p className=''>{ task.type }</p>
              <p className='font-semibold'>{ task.title}</p>
          </div>

      <input type="checkbox" name={ task.type } id="myCheckbox" onChange={ () => setChecked(!checked)} checked={checked} />
    </label>
  )
}

export default ActiveTask