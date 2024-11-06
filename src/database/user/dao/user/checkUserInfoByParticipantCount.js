const { User, Participant, Event } = require('../../../../database')

module.exports = async () => {
    try {
        const users = await User.findAll({
            order: [['participant_count', 'DESC']],
            attributes: ['name', 'major', 'student_code', 'participant_count'],
            include: [
                {
                    model: Participant,
                    attributes: ['event_code'],
                    required: false,
                    include: [
                        {
                            model: Event,
                            attributes: ['event_name'],
                            required: false,
                        }
                    ]
                }
            ]
        });
        
        return users;
    } catch (err) {
        throw err;
    }
}
