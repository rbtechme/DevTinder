const { CronJob } = require('cron');
const ConnectionRequest = require('../models/connectionRequest');
const { subDays, startOfDay, endOfDay } = require('date-fns');

const job = new CronJob(
    '0 13 * * *', // cronTime
    async function () {
        try {
            const yesterday = subDays(new Date(), 0);

            const yesterdayStart = startOfDay(yesterday);
            const yesterdayEnd = endOfDay(yesterday);

            console.log('yesterdayStart:', yesterdayStart);
            const pendingRequests = await ConnectionRequest.find({
                status: 'interested',
                createdAt: { 
                    $gte: yesterdayStart,
                    $lt: yesterdayEnd,
                },
            }).populate('fromUserId toUserId');

            const listofEmails = [...new Set(pendingRequests.map(request => request.toUserId.emailId))];
            console.log('listofEmails:', listofEmails);
            
        } catch (error) {
            console.error('Error:', error);
        }
    }, // onTick
    null, // onComplete
    true, // start
    null // timeZone
);

module.exports = job;