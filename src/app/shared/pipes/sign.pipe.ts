import { Pipe, PipeTransform } from '@angular/core';
import { Sign } from 'src/app/commons/models/game.model';

@Pipe({
  name: 'sign'
})
export class SignPipe implements PipeTransform {

  transform(value: Sign): string {
    switch (value) {
      case "B":
        return "Bastoni";
      case "C":
        return "Coppe";
      case "D":
        return "Denari";
      case "S":
        return "Spade";

      default:
        return "";
    }
  }

}
