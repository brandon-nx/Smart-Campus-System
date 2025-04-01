// You can expand this based on hallway connections
const graph = {
    "main-entrance": { "student-adminsitration-and-service-office-2r022": 300 },
    "student-adminsitration-and-service-office-2r022": { 
        "main-entrance": 300, 
        "lecture-hall-2r016": 300 
    },
    "lecture-hall-2r016": { "student-adminsitration-and-service-office-2r022": 300 },
};
  
export default graph;
  