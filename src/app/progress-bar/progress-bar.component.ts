import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {

  textoSubiendo: string = "Subiendo archivo";
  @Input() progress: number;
  @Input() total: number;
  color: string;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterContentChecked(): void {

    if(this.progress == 100){
       //this.textoSubiendo = "Archivo subido exitosamente";
    }

    //Called after every check of the component's or directive's content.
    //Add 'implements AfterContentChecked' to the class.
    //if we don't have progress, set it to 0.
    if(!this.progress) {
    this.progress = 0;
    }
    //if we don't have a total aka no requirement, it's 100%.
    if(this.total === 0) {
    this.total = this.progress;
    } else if(!this.total) {
    this.total = 100;
    }
    //if the progress is greater than the total, it's also 100%.
    if(this.progress > this.total) {
    this.progress = 100;
    this.total = 100;
    }
    this.progress = (this.progress / this.total) * 100;
    if(this.progress < 55) {
    this.color = 'red';
    ////console.log("la barra del progress es roja");
    } else if(this.progress < 75) {
    this.color= 'yellow';
    ////console.log("la barra del progress es amarilla");
    } else {

    this.color = 'green';
    // //console.log("la barra del progress es verde");
    }
 }

}
