// Mock data to simulate API response
const mockEvents = [
  {
    id: 1,
    title: "CISCO Talk 2025",
    date: "5th May 2025 | 6:00PM - 7:00PM",
    location: "Lecture Hall 2R021 (2nd Floor)",
    description:
      "description description description description description description description description description description description description description description",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7rtRG48hAkPZCcha80xdycQRwPcpW8.png",
  },
  {
    id: 2,
    title: "CISCO Talk 2025",
    date: "5th May 2025 | 6:00PM - 7:00PM",
    location: "Lecture Hall 2R021 (2nd Floor)",
    description:
      "description description description description description description description description description description description description description description",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7rtRG48hAkPZCcha80xdycQRwPcpW8.png",
  },
  {
    id: 3,
    title: "CISCO Talk 2025",
    date: "6th May 2025 | 6:00PM - 7:00PM",
    location: "Lecture Hall 2R021 (2nd Floor)",
    description:
      "description description description description description description description description description description description description description description",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-7rtRG48hAkPZCcha80xdycQRwPcpW8.png",
  },
];

// Simulated fetch function
export async function fetchEvents(id) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (id) {
    return mockEvents.find((event) => event.id === parseInt(id)) || null;
  }

  return mockEvents;
}

// Simulated fetch function for a single event
export async function fetchEvent(id) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return mockEvents.find((event) => event.id === parseInt(id)) || null;
}
