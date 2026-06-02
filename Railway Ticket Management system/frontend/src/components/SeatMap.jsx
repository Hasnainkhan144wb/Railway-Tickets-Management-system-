import React from "react";

const SeatMap = ({ coachSeats, selectedSeats, onSeatClick, ticketPrice }) => {
  // Filter seats and berths
  const seatsList = coachSeats.filter((s) => s.seatNumber.endsWith("S"));
  const berthsList = coachSeats.filter((s) => s.seatNumber.endsWith("B"));

  // Function to get seat background and hover classes
  const getSeatStyle = (seatNumber) => {
    const dbSeat = coachSeats?.find((s) => s.seatNumber === seatNumber);
    if (dbSeat?.booked) {
      return "bg-red-500 text-white cursor-not-allowed";
    }
    if (selectedSeats.includes(seatNumber)) {
      return "bg-blue-600 text-white";
    }
    return "bg-green-500 hover:bg-green-600 text-white";
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Legend */}
      <div className="flex gap-8 items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-500 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-600 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-red-500 rounded"></div>
          <span>Booked</span>
        </div>
      </div>

      <div className="w-full space-y-6 max-w-xl">
        {/* SECTION 1: SIDE SEATS */}
        {seatsList.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="border-b pb-2 mb-4">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center justify-between">
                <span>Side Seats (Aisle & Window)</span>
                <span className="text-xs font-semibold text-gray-500 normal-case bg-gray-100 px-2 py-0.5 rounded-full">
                  {seatsList.length} Seats
                </span>
              </h3>
            </div>
            {/* 3-column layout: Left Seats, Aisle, Right Seats */}
            <div className="grid grid-cols-[1fr_20px_1fr] gap-3 items-center">
              <div className="grid grid-cols-2 gap-2">
                {seatsList.slice(0, Math.ceil(seatsList.length / 2)).map((seat) => (
                  <button
                    key={seat.seatNumber}
                    type="button"
                    disabled={seat.booked}
                    onClick={() => onSeatClick(seat.seatNumber)}
                    className={`flex flex-col items-center justify-center py-2 rounded-lg font-semibold transition-all duration-150 border border-black/5 h-11 ${getSeatStyle(seat.seatNumber)}`}
                  >
                    <span className="text-xs">{seat.seatNumber}</span>
                    <span className="text-[7px] opacity-80 font-light">Rs.{ticketPrice}</span>
                  </button>
                ))}
              </div>
              <div className="h-full flex items-center justify-center text-[10px] text-gray-300 font-bold select-none">|</div>
              <div className="grid grid-cols-2 gap-2">
                {seatsList.slice(Math.ceil(seatsList.length / 2)).map((seat) => (
                  <button
                    key={seat.seatNumber}
                    type="button"
                    disabled={seat.booked}
                    onClick={() => onSeatClick(seat.seatNumber)}
                    className={`flex flex-col items-center justify-center py-2 rounded-lg font-semibold transition-all duration-150 border border-black/5 h-11 ${getSeatStyle(seat.seatNumber)}`}
                  >
                    <span className="text-xs">{seat.seatNumber}</span>
                    <span className="text-[7px] opacity-80 font-light">Rs.{ticketPrice}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: CABIN BERTHS */}
        {berthsList.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="border-b pb-2 mb-4">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center justify-between">
                <span>Sleeper Cabins & Berths</span>
                <span className="text-xs font-semibold text-gray-500 normal-case bg-gray-100 px-2 py-0.5 rounded-full">
                  {berthsList.length} Berths
                </span>
              </h3>
            </div>
            
            {/* Dynamically group berths into cabins of 6 */}
            <div className="space-y-5 max-h-[350px] overflow-y-auto pr-1">
              {Array.from({ length: Math.ceil(berthsList.length / 6) }).map((_, cabinIdx) => {
                const cabinBerths = berthsList.slice(cabinIdx * 6, cabinIdx * 6 + 6);
                return (
                  <div key={cabinIdx} className="border border-gray-100 rounded-xl p-3 bg-gray-50/50 shadow-sm relative">
                    <div className="text-[9px] font-bold text-gray-400 tracking-wider uppercase mb-2">
                      Cabin {cabinIdx + 1}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Left Bench */}
                      <div className="space-y-1.5 border-r border-dashed border-gray-200 pr-2">
                        <div className="text-[8px] text-gray-400 text-center font-semibold mb-0.5">Left Bench</div>
                        {cabinBerths.slice(0, 3).map((seat) => (
                          <button
                            key={seat.seatNumber}
                            type="button"
                            disabled={seat.booked}
                            onClick={() => onSeatClick(seat.seatNumber)}
                            className={`w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg font-semibold transition-all duration-150 border border-black/5 text-xs h-9 ${getSeatStyle(seat.seatNumber)}`}
                          >
                            <span>{seat.seatNumber}</span>
                            <span className="text-[8px] opacity-75 font-normal">
                              {seat.seatNumber === cabinBerths[0]?.seatNumber ? "Lower" : seat.seatNumber === cabinBerths[1]?.seatNumber ? "Middle" : "Upper"}
                            </span>
                          </button>
                        ))}
                      </div>
                      
                      {/* Right Bench */}
                      <div className="space-y-1.5 pl-2">
                        <div className="text-[8px] text-gray-400 text-center font-semibold mb-0.5">Right Bench</div>
                        {cabinBerths.slice(3, 6).map((seat) => (
                          <button
                            key={seat.seatNumber}
                            type="button"
                            disabled={seat.booked}
                            onClick={() => onSeatClick(seat.seatNumber)}
                            className={`w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg font-semibold transition-all duration-150 border border-black/5 text-xs h-9 ${getSeatStyle(seat.seatNumber)}`}
                          >
                            <span>{seat.seatNumber}</span>
                            <span className="text-[8px] opacity-75 font-normal">
                              {seat.seatNumber === cabinBerths[3]?.seatNumber ? "Lower" : seat.seatNumber === cabinBerths[4]?.seatNumber ? "Middle" : "Upper"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatMap;
