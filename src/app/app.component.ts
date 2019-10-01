import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  Oobject = Object;
  semestersCgpas: {};
  semesterList: any[];

  result: number;
  avg: number;

  // @ViewChild('stepper', {static: true}) stepper: MatStepper;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: [
        "",
        [
          Validators.required,
          Validators.min(1),
          Validators.max(10),
          Validators.pattern("^[0-9]*$")
        ]
      ]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ["", Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      expectedCgpa: [
        "",
        [
          Validators.required,
          Validators.min(1),
          Validators.max(10),
          Validators.pattern("[0-9](.[0-9][0-9]?)?")
        ]
      ],
      expectedSemester: [""]
    });
  }

  gotSemesters() {
    console.log(this.firstFormGroup);
    // console.log('stepper', this.stepper);

    let semestersSoFar = this.firstFormGroup.value.firstCtrl;

    this.thirdFormGroup.controls["expectedSemester"].setValidators([
      Validators.min(semestersSoFar + 1),
      Validators.max(10),
      Validators.required,
      Validators.pattern("^[0-9]*$")
    ]);
    this.thirdFormGroup.controls["expectedSemester"].updateValueAndValidity();

    this.semestersCgpas = {};
    for (let i = 1; i <= semestersSoFar; i++) {
      this.semestersCgpas = {
        ...this.semestersCgpas,
        [i]: [
          "",
          [
            Validators.required,
            Validators.min(1),
            Validators.max(10),
            Validators.pattern("[0-9](.[0-9][0-9]?)?")
          ]
        ]
      };
    }
    this.secondFormGroup = this._formBuilder.group(this.semestersCgpas);
    this.semesterList = Object.keys(this.semestersCgpas);
  }

  gotCgpas() {
    console.log("second form group", this.secondFormGroup);
    // console.log('stepper', this.stepper);
  }

  gotExpectedData() {
    const semestersSoFar = this.firstFormGroup.value.firstCtrl;
    const semestersCgpas = this.secondFormGroup.value;
    const expectedGPA = this.thirdFormGroup.value.expectedCgpa;
    const expectedSem = this.thirdFormGroup.value.expectedSemester;

    let sum = 0;
    Object.keys(semestersCgpas).forEach((sem: any) => {
      sum += parseFloat(semestersCgpas[sem]);
    });
    this.avg = sum / semestersSoFar;
    this.result =
      (expectedGPA * expectedSem - sum) / (expectedSem - semestersSoFar);
    this.result = parseFloat(this.result.toFixed(2));
  }
}
