import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatTableModule} from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule} from '@angular/material/radio';
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatTabsModule} from '@angular/material/tabs';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { MatDividerModule} from '@angular/material/divider';

@NgModule({
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatTableModule,
    MatDialogModule,
    MatRadioModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatExpansionModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatDividerModule

  ],
  exports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatTableModule,
    MatDialogModule,
    MatRadioModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatExpansionModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatDividerModule
  ],
  declarations: [

  ],
  providers: [],
})
export class MaterialModule { }
