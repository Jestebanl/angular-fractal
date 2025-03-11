import { Component } from '@angular/core';
import { ArtboardComponent } from "../artboard/artboard.component";
import { AsideBarComponent } from "../aside-bar/aside-bar.component";

@Component({
  selector: 'app-layout',
  imports: [ArtboardComponent, AsideBarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export default class LayoutComponent {

}
