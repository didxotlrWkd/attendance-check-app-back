const XLSX = require('xlsx')

module.exports = async (students) => {

    try {
        const eventNames = ["개회식", "학술제 본선 관람", "졸업생 토크콘서트", "게임플레이 경진대회", "산업체전문가 특강"];

        // 데이터 변환
        const data = students.map(student => {
            const participation = {};

            // 기본 정보 추가
            participation.학번 = student.student_code;
            participation.이름 = student.name;
            participation.학과 = student.major;
            participation.참여횟수 = student.participant_count;

            // 각 이벤트에 대해 참여 여부 설정
            eventNames.forEach(eventName => {
                participation[eventName] = student.participants.some(participant =>
                    participant.event.includes(eventName)
                ) ? 'O' : 'X';
            });

            return participation;
        });
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