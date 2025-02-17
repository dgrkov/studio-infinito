import Reactm, {useState} from "react";
import Reservations from "../AdminReservations/Reservations";
import { useNavigate } from 'react-router-dom'

export default function AdminReservationForm() {
    const navigate = useNavigate();
    const handleRedirect = () => {
      navigate('/admin');
    }

    const workReqs = [
        { name: "Шишање", price: 500, time: "30 min" },
        { name: "Фарбање", price: 1000, time: "1 h" },
        { name: "Фенирање", price: 400, time: "30 min" },
    ];

    const employees = ["Александар", "Марина"];

    return (
        <div className="flex items-center justify-center p-12">
            <div className="mx-auto w-full max-w-[550px]">
                <form action="https://formbold.com/s/FORM_ID" method="POST">
                <div className="-mx-3 flex flex-wrap">
                    <div className="w-full px-3 sm:w-1/2">
                        <div className="mb-5">
                            <label for="fName" className="mb-3 block text-base font-medium text-[#07074D]">
                                Име
                            </label>
                            <input type="text" name="fName" id="fName" placeholder="First Name" 
                            className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"/>
                        </div>
                    </div>
                    <div className="w-full px-3 sm:w-1/2">
                        <div className="mb-5">
                            <label for="lName" className="mb-3 block text-base font-medium text-[#07074D]">
                                Презиме
                            </label>
                            <input type="text" name="lName" id="lName" placeholder="Last Name"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                            />
                        </div>
                    </div>
                </div>
                {/* <div className="mb-5">
                    <label for="guest"
                        className="mb-3 block text-base font-medium text-[#07074D]">
                        How many guest are you bringing?
                    </label>
                    <input type="number" name="guest" id="guest" placeholder="5" min="0"
                        className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"/>
                </div> */}
                <div className="-mx-3 flex flex-wrap">
                    <div className="w-full px-3 sm:w-1/2">
                        <div className="mb-5">
                            <label for="service" className="mb-3 block text-base font-medium text-[#07074D]">
                                Тип на услуга
                            </label>
                            <select className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md">
                                {workReqs.map((req) => (
                                <option key={req} value={req}>
                                    {req.name} - {req.price} din - {req.time}
                                </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="w-full px-3 sm:w-1/2">
                        <div className="mb-5">
                            <label for="" className="mb-3 block text-base font-medium text-[#07074D]">
                                Фризер
                            </label>
                            <select className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md">
                                {employees.map((employee) => (
                                <option key={employee} value={employee}>
                                    {employee}
                                </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="-mx-3 flex flex-wrap">
                    <div className="w-full px-3 sm:w-1/2">
                        <div className="mb-5">
                            <label for="date" className="mb-3 block text-base font-medium text-[#07074D]">
                                Датум
                            </label>
                            <input type="date" name="date" id="date"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"/>
                        </div>
                    </div>
                    <div className="w-full px-3 sm:w-1/2">
                        <div className="mb-5">
                            <label for="time" className="mb-3 block text-base font-medium text-[#07074D]">
                                Време
                            </label>
                            <input type="time" name="time" id="time" step="1800" lang="en-GB"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"/>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <button type="submit" className="hover:shadow-form hover:bg-gray-800 rounded-md bg-black py-3 px-8 text-center text-base font-semibold text-white outline-none">
                    Потврди
                    </button>
                </div>
                </form>
                <div className="flex items-center justify-center py-2">
                    <button onClick={handleRedirect} className="hover:shadow-form hover:bg-gray-800 rounded-md bg-black py-3 px-8 text-center text-base font-semibold text-white outline-none">
                    Назад кон список
                    </button>
                </div>
            </div>
        </div>
    );
}