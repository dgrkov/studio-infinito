import './HTMLElements.css'

export default function ServiceCard({ serviceType, handleWorkReq, onClick }) {
    return (
        <div onClick={onClick} className={`card bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md flex mb-5 w-full lg:h-52 xl:h-72 md:w-[50%] xl:[30%]`}>
            <div className='flex-1 rounded-lg service-card-image mr-4' >

            </div>
            <div className="flex-1 pb-4 pr-4">
                <h3 className="card__title dark:hover:text-gray-400 text-lg font-semibold">{ serviceType.name }</h3>
                <p className="card__content text-[12px] sm:text-sm dark:text-white">Секоја картичка ке има свое објаснување и колку време трае</p>
                <div className="card__date text-sm text-gray-600 dark:text-gray-400">
                    {serviceType.price} ден. / {serviceType.duration} мин.
                </div>
                <div className="card__arrow bg-black">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="15" width="15">
                        <path fill="#fff" d="M13.4697 17.9697C13.1768 18.2626 13.1768 18.7374 13.4697 19.0303C13.7626 19.3232 14.2374 19.3232 14.5303 19.0303L20.3232 13.2374C21.0066 12.554 21.0066 11.446 20.3232 10.7626L14.5303 4.96967C14.2374 4.67678 13.7626 4.67678 13.4697 4.96967C13.1768 5.26256 13.1768 5.73744 13.4697 6.03033L18.6893 11.25H4C3.58579 11.25 3.25 11.5858 3.25 12C3.25 12.4142 3.58579 12.75 4 12.75H18.6893L13.4697 17.9697Z"></path>
                    </svg>
                </div>
            </div>
        </div>
    )
} 