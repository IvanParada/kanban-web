import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-public-layout-component',
  imports: [RouterOutlet],
  templateUrl: './public-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutComponent { }
