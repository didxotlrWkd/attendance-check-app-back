const XLSX = require('xlsx')

module.exports = async (students) => {
    try {
        const data = students.map(student => ({
            학번: student.student_code,
            이름: student.name,
            학과: student.major,
            참여횟수: student.participant_count,
        }));
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, '학생 데이터')

        const filePath = 'students.xlsx';
        XLSX.writeFile(workbook, filePath);

        return filePath

    } catch (err) {
        console.error(err)
        throw err
    }
}