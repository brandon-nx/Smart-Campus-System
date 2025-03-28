import { useEffect, useState } from "react";

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
      {timeSlots.map((slot) => (
        <button
          key={slot}
          className={`time-slot-button ${
            selectedSlot === slot ? "selected" : ""
          }`}
          onClick={() => handleSlotClick(slot)}
          type="button"
        >
          {slot}
        </button>
      ))}
    </div>
  );
}
