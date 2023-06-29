export function Loader() {
  return (
    <div className='fixed left-[50%] top-[50%] z-[99] flex h-[200px] w-[500px] -translate-x-1/2 -translate-y-1/2 transform items-center justify-center bg-black opacity-90'>
      <div className='mx-5 my-5 flex flex-row items-center'>
        <img
          src='/brewing.gif'
          alt='Loading...'
          className='mb-4 h-12 w-12 bg-black'
        />
        <p className='ml-4 text-white'>
          Brewing
          <span className='dot-1'>.</span>
          <span className='dot-2'>.</span>
          <span className='dot-3'>.</span>
        </p>
      </div>
    </div>
  )
}
