import chalk from 'chalk';
import {Command} from './command.interface.js';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
  ${chalk.bold.white('Программа для подготовки данных для REST API сервера.')}

  ${chalk.bold.yellow('Пример:')}
      ${chalk.grey('cli.js')} ${chalk.green('--<command>')} ${chalk.blue('[--arguments]')}

  ${chalk.bold.yellow('Команды:')}
      ${chalk.green('--version')}:                   ${chalk.white('# выводит номер версии')}
      ${chalk.green('--help')}:                      ${chalk.white('# печатает этот текст')}
      ${chalk.green('--import')} ${chalk.blue('<path>')}:             ${chalk.white('# импортирует данные из TSV')}
      ${chalk.green('--generate')} ${chalk.blue('<n> <path> <url>')}: ${chalk.white('# генерирует произвольное количество тестовых данных')}
`);
  }
}
