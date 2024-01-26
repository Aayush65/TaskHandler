import cron from 'node-cron';
import dailyReminders from './dailyReminder';

cron.schedule('0 0 * * *', dailyReminders);