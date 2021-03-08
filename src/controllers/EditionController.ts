import { Edition } from '../constants/Edition';

export default interface EditionController {
  edition: Edition;

  mousedownEventHandler(event: MouseEvent): void;
  mousemoveEventHandler(event: MouseEvent): void;
  mouseupEventHandler(event: MouseEvent): void;
}
