export function downloadCSV(data, filename) {
    const convertToCSV = (array) => {
        const header = Object.keys(array[0]).join(",");
        const rows = array.map(obj => Object.values(obj).join(","));
        return [header, ...rows].join("\n");
    };

    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
