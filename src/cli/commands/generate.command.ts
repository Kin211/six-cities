import {Command} from './command.interface.js';
import {isMockServerData, MockServerData} from '../../shared/types/index.js';
import {TSVOfferGenerator} from '../../shared/libs/offer-generator/index.js';
import {getErrorMessage} from '../../shared/helpers/index.js';
import {TSVFileWriter} from '../../shared/libs/file-writer/index.js';

export class GenerateCommand implements Command {
  private initialData!: MockServerData;

  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      await this.load(url);
      await this.write(filepath, offerCount);
      console.info(`File ${filepath} was created!`);
    } catch (error: unknown) {
      console.error('Can\'t generate data');
      console.error(getErrorMessage(error));
    }
  }

  private async load(url: string) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed load from ${url}. Status: ${response.status}`);
      }

      const fetchedData: unknown = await response.json();

      if (!isMockServerData(fetchedData)) {
        throw new Error('Dont match with MockServerData');
      }

      this.initialData = fetchedData;
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(filepath: string, offerCount: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(tsvOfferGenerator.generate());
    }
  }
}
