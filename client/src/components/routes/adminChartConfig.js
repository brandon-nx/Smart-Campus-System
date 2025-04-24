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
                    stacked: true,
                    beforeUpdate: function(axis) {
                        const labels = axis.chart.data.labels;
                        for (let i = 0; i < labels.length; i++) {
                            const label = labels[i];
                            if (typeof label === 'string' && label.length > 10) {
                                labels[i] = label.substring(0, 10) + '...'; // Truncates and adds ellipsis
                            }
                        }
                    }
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
export function roomDetailsConfig(roomDetailsData) {
    return {
        type: 'line',
        data: roomDetailsData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Room Details Chart',
                },
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time',
                    },
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Value',
                    },
                    beginAtZero: true,
                },
            },
        },
    };
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