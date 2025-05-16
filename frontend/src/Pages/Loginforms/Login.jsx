import React from 'react'

function Login() {
    return (
        <div className='flex items-center justify-center'><form action="" className='w-full border'>
            <label htmlFor="">Username</label>
            <input type="text" placeholder='Username' className='block' />
            <label htmlFor="" >Password</label>
            <input type="text" placeholder='USername' className='block' />
            <button>login</button>
            <p>not a memeber ? <a href="">Register</a> </p>
        </form></div>
    )
}

export default Login