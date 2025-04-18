export function eventsConfig(eventData) {
    return {
        type: 'bar',
        data: eventData, // This should be an object with labels and datasets
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Events Statistics',
                },
            },
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    beginAtZero: true
                }
            },
        },
    };
}
export function attendanceConfig(attendanceData){ return {
    type: 'bar',
    data: attendanceData,
    options: {scales: {
        x: {
            stacked: true
        },
        y: {
            stacked: true
        }
    }}
  }

}

export function roomsConfig(roomData){ return {
    type: 'bar',
    data: roomData,
    options: {scales: {
        x: {
            stacked: true
        },
        y: {
            stacked: true
        }
    }}
  }
}
export function bookingConfig(roomData){ return {
    type: 'bar',
    data: roomData,
    options: {scales: {
        x: {
            stacked: true
        },
        y: {
            stacked: true
        }
    }}
  }
}