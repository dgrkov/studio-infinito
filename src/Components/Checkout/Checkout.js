import React from "react";

const Checkout = () => {
  return (
    <div className="container">
      <div className="mt-5 ">
        <div className="w-full md:w-1/2 mx-auto bg-white rounded-md">
          {/* First Section */}
          <div className="flex flex-col justify-center items-center">
            <h6 className="text-black font-medium my-4">Order Summary</h6>
            <div className="flex justify-between items-center w-full py-5 border-b-2 border-gray-200">
              <p className="text-gray-400 ml-4">Subtotal</p>
              <p className="text-black mr-4">$2,650</p>
            </div>
            <div className="flex justify-between items-center w-full py-5 border-b-2 border-gray-200">
              <p className="text-gray-400 ml-4">Shipping</p>
              <p className="text-black mr-4">$15</p>
            </div>
            <div className="flex justify-between items-center w-full py-5 border-b-2 border-gray-200">
              <p className="text-gray-400 ml-4">VAT (included)</p>
              <p className="text-black mr-4">20%</p>
            </div>
            <div className="flex justify-between items-center w-full py-5 border-b-2 border-gray-200">
              <p className="text-gray-400 ml-4">Total</p>
              <p className="text-indigo-600 mr-4">$2,665</p>
            </div>

            <div className="flex flex-col justify-between items-center px-3 py-5 w-full">
              <div className="mb-5 flex flex-col min-w-full">
                <label htmlFor="code" className="font-medium text-black">
                  Add promo code
                </label>
                <input
                  type="text"
                  id="code"
                  className="w-full py-2 border mt-3 border-gray-300 rounded-md"
                />
              </div>
              <button className="w-full bg-indigo-600 text-white px-2 py-2 rounded-md">
                Apply Code
              </button>
            </div>
            <div className="px-3 py-5 border-b-2 border-gray-200">
              <button className="min-w-full bg-gray-400 font-semibold text-white px-2 py-2 rounded-md">
                Checkout
              </button>
            </div>
          </div>
          {/* End */}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
