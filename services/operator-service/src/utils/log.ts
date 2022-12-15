import * as fs from 'fs';
import * as moment from 'moment';

import { LOG_PATH, LOG_RETENTION_DURATION } from '../constants';

export const readFile = (path) => {
  return new Promise((resolve, reject) => {
    try {
      const data = fs.readFileSync(path);
      console.log('#utils/log - readFile() - log: ' + data);
      return resolve(data);
    } catch (err) {
      console.log('#utils/log - readFile() - error: ' + err);
      return reject(err);
    }
  });
};

export const writeFile = (data) => {
  const now = moment(Date.now()).format('YYYYMMDD');
  const path = `${LOG_PATH}/${now}.lg`;

  if (fs.existsSync(path)) {
    // Append new data into log file!
    fs.appendFileSync(path, data);
  } else {
    // Delete old files in log directory!
    unlinkFiles(LOG_RETENTION_DURATION);

    // Create a new log file!
    fs.writeFileSync(path, data);
  }
};

export const unlinkFiles = (expired) => {
  fs.readdir(LOG_PATH, (err, items) => {
    if (err) console.log('#utils/index - deleteFiles() - error: ' + err);
    else {
      const n = new Date();
      const now = moment(new Date(n.getFullYear(), n.getMonth(), n.getDate()));

      for (let i = 0; i < items.length; i++) {
        const filename = `${LOG_PATH}/${items[i]}`;
        fs.stat(filename, (err, stats) => {
          if (err) {
            console.log('#utils/index - deleteFiles() - error: ' + err);
            return;
          }

          const ctime = new Date(stats['ctime']);
          const created_date = moment(
            new Date(ctime.getFullYear(), ctime.getMonth(), ctime.getDate()),
          );

          const duration = moment.duration(now.diff(created_date));
          const days = duration.asDays();

          if (days >= expired) {
            fs.unlink(filename, (err) => {
              console.log('#utils/index - readFile() - error: ' + err);
            });
          }
        });
      }
    }
  });
};
