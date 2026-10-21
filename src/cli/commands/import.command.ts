import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { createOffer, getErrorMessage, getMongoURI } from '../../shared/helpers/index.js';
import { UserServiceInterface, DefaultUserService, UserModel } from '../../shared/modules/user/index.js';
import { OfferServiceInterface, DefaultOfferService, OfferModel } from '../../shared/modules/offer/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { ConsoleLogger } from '../../shared/libs/logger/console.logger.js';
import { DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from './command.constant.js';
import { Offer } from '../../shared/types/index.js';

export class ImportCommand implements Command {
  private userService: UserServiceInterface;
  private offerService: OfferServiceInterface;
  private databaseClient: DatabaseClient;
  private logger: Logger;
  private salt!: string;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private async onCompleteImport(count: number) {
    this.logger.info(`Импорт успешно завершен! Сохранено строк: ${count}.`);
    await this.databaseClient.disconnect();
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate({
      ...offer.host,
      password: DEFAULT_USER_PASSWORD,
    }, this.salt);

    await this.offerService.create({
      title: offer.title,
      description: offer.description,
      postDate: offer.postDate,
      city: offer.city,
      previewImage: offer.previewImage,
      photosLinks: offer.photosLinks,
      isPremium: offer.isPremium,
      housingType: offer.housingType,
      bedrooms: offer.bedrooms,
      maxGuests: offer.maxGuests,
      price: offer.price,
      amenities: offer.amenities,
      location: offer.location,
      userId: user._id.toString(),
    });
  }

  public getName(): string {
    return '--import';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename, login, password, host, dbname, salt] = parameters;
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    try {
      await this.databaseClient.connect(uri);

      const fileReader = new TSVFileReader(filename.trim());

      fileReader.on('line', this.onImportedLine);
      fileReader.on('end', this.onCompleteImport);

      await fileReader.read();
    } catch (error) {
      this.logger.error(`Не удалось импортировать данные из файла: ${filename}`, error as Error);
      this.logger.error(`Причина: ${getErrorMessage(error)}`, error as Error);
      await this.databaseClient.disconnect();
    }
  }
}
