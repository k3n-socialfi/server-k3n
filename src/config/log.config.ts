import { LoggerType } from '@common/constants/enum';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import { LoggerOptions } from 'winston';

export class LogConfig {
  /**
   * @param  {LoggerType} type
   * @returns LoggerOptions
   */
  public static getWinstonConfig(type: LoggerType): LoggerOptions {
    return {
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.splat(), // Necessary to produce the 'meta' property
        winston.format.simple()
      ),
      // options
      transports: [
        new winston.transports.File({
          filename: `logs/${type}/${type}-info.log`,
          format: winston.format.combine(winston.format.timestamp(), nestWinstonModuleUtilities.format.nestLike()),
          level: 'info'
        }),
        new winston.transports.File({
          filename: `logs/${type}/${type}-error.log`,
          format: winston.format.combine(winston.format.timestamp(), nestWinstonModuleUtilities.format.nestLike()),
          level: 'error'
        }),
        new winston.transports.File({
          filename: `logs/${type}/${type}-debug.log`,
          format: winston.format.combine(winston.format.timestamp(), nestWinstonModuleUtilities.format.nestLike()),
          level: 'debug'
        }),
        new winston.transports.Console({
          format: winston.format.combine(winston.format.timestamp(), nestWinstonModuleUtilities.format.nestLike()),
          level: process.env.CONSOLE_LOG_LEVEL || 'info'
        })
      ]
    };
  }
}
