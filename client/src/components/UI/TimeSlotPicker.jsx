import { useEffect, useState } from "react";
import { convert24To12 } from "../util/converter";

export default function TimeSlotPicker({
  onChange,
  initialSelected = "",
  name,
  timeSlots,
}) {
  const [selectedSlot, setSelectedSlot] = useState(initialSelected);

  const handleSlotClick = (slot) => {
    // For single selection, we just set the new slot as selected
    setSelectedSlot(slot);
  };

  // Call onChange whenever selectedSlot changes
  useEffect(() => {
    if (onChange) {
      onChange(selectedSlot);
    }
  }, [selectedSlot, onChange]);

  return (
    <div className="time-slot-selector">
      {/* Hidden input for form submission */}
      <input type="hidden" id={name} name={name} value={selectedSlot} />
      {timeSlots.map(({slot, status}) => (
        <button
          key={slot}
          disabled={status === 'unavailable'}
          className={`time-slot-button ${
            selectedSlot === slot ? "selected" : ""
          }`}
          onClick={() => handleSlotClick(slot)}
          type="button"
        >
          {convert24To12(slot)}
        </button>
      ))}
    </div>
  );
}
