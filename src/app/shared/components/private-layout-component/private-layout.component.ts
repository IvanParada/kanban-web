import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Navbar } from "../navbar/navbar.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-private-layout-component',
  imports: [Navbar, RouterOutlet],
  templateUrl: './private-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivateLayoutComponent { }
