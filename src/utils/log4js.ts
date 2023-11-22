import log4js from 'log4js';

log4js.configure({
  appenders: {
    console: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: `%r - %[[%p]%] %m`
      }
    },
    brightConsole: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: `%[%r - [%p] %m%]`
      }
    },
    log: {
      type: 'dateFile',
      filename: 'logs/date.log',
      pattern: 'yyyy-MM-dd',
      keepFileExt: true,
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern: `%h %d{ISO8601} - [%p] %m`
      }
    }
  },
  categories: {
    default: { appenders: ["console"], level: "trace" },
    brightPrint: { appenders: ["brightConsole"], level: "trace" },
    log: { appenders: ["console", "log"], level: "trace" },
    brightLog: { appenders: ["brightConsole", "log"], level: "trace" },
  },
});

export const printer = log4js.getLogger('brightPrint');
export const logger = log4js.getLogger('log');