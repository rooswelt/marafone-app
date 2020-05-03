import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Game } from 'src/app/commons/models/game.model';

@Component({
  selector: 'app-seats',
  templateUrl: './seats.component.html',
  styleUrls: ['./seats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SeatsComponent implements OnChanges {

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentGame) {
      const game = changes.currentGame.currentValue;
      if (!game.player_1_name) this.availableSeats.push(1);
      if (!game.player_2_name) this.availableSeats.push(2);
      if (!game.player_3_name) this.availableSeats.push(3);
      if (!game.player_4_name) this.availableSeats.push(4);
    }
  }

  availableSeats: number[] = [];
  joinForm: FormGroup;

  @Input()
  currentGame: Game;

  @Output()
  onCancel: EventEmitter<any> = new EventEmitter();

  @Output()
  onRejoin: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  onJoin: EventEmitter<{ position: number, name: string, password: string }> = new EventEmitter<{ position: number, name: string, password: string }>();

  @Output()
  onAsAdmin: EventEmitter<any> = new EventEmitter();


  constructor(private fb: FormBuilder) {
    this._createForm();
  }

  private _createForm() {
    let group = {
      position: ["", Validators.required],
      name: ["", Validators.required],
      password: [""]
    }
    this.joinForm = this.fb.group(group);
  }

  join() {
    this.onJoin.emit({
      name: this.joinForm.value.name,
      position: this.joinForm.value.position,
      password: this.joinForm.value.password
    })
  }

  rejoin(position: number) {
    this.onRejoin.emit(position);
  }

  asAdmin() {
    this.onAsAdmin.emit();
  }

  cancel() {
    this.onCancel.emit();
  }
}
