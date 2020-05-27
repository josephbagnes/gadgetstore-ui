import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

class Gadget {
  constructor(
    public id: number = 0,
    public serialNumber: string = '',
    public brand: string = '',
    public model: string = '',
    public price: string = ''
  ) {}
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  // It maintains list of Registrations
  gadgets: Gadget[] = [];
  // It maintains Gadget Model
  gadgetModel: Gadget;
  // It maintains Gadget form display status. By default it will be false.
  showNew: Boolean = false;
  // It will be either 'Save' or 'Update' based on operation.
  submitType: string = 'Save';
  // It maintains table row index based on selection.
  selectedRow: number;

  api: string = environment.api;
  httpOptions = {
    headers: new HttpHeaders({ 'content-type': 'application/json' })
  };

  keyword: string = '';

  constructor(private http: HttpClient) {
    
  }

  refreshList(){
    this.keyword = '';
    this.http.get<Gadget[]>(`${this.api}/get-all`).subscribe(gadgets => this.gadgets = gadgets);
  }

  ngOnInit() {
    this.refreshList();
  }

  // This method associate to New Button.
  onNew() {
    // Initiate new Gadget.
    this.gadgetModel = new Gadget();
    // Change submitType to 'Save'.
    this.submitType = 'Save';
    // display Gadget entry section.
    this.showNew = true;
  }

  // This method associate to Save Button.
  onSave() {
    if (this.submitType === 'Save') {
      // Push Gadget model object into Gadget list.
      // this.gadgets.push(this.gadgetModel);
      this.http.post(`${this.api}/register-product`, this.gadgetModel, this.httpOptions).subscribe(response => {
        this.refreshList();
      });
    } else {
      // Update the existing properties values based on model.
      // this.gadgets[this.selectedRow].id = this.gadgetModel.id;
      // this.gadgets[this.selectedRow].serialNumber = this.gadgetModel.serialNumber;
      // this.gadgets[this.selectedRow].brand = this.gadgetModel.brand;
      // this.gadgets[this.selectedRow].model = this.gadgetModel.model;
      // this.gadgets[this.selectedRow].price = this.gadgetModel.price;
      this.http.put(`${this.api}/update/${this.gadgetModel.id}`, this.gadgetModel, this.httpOptions).subscribe(response => {
        this.refreshList();
      });
    }
    // Hide Gadget entry section.
    this.showNew = false;
  }

  // This method associate to Edit Button.
  onEdit(id: number) {
    // Assign selected table row index.
    // this.selectedRow = id;
    // Initiate new Gadget.
    // this.gadgetModel = new Gadget();
    // Retrieve selected Gadget from list and assign to model.
    // this.gadgetModel = Object.assign({}, this.gadgets[this.selectedRow]);
    // Change submitType to Update.
    this.http.get<Gadget>(`${this.api}/view/${id}`).subscribe(gadget => this.gadgetModel = gadget);
    this.submitType = 'Update';
    // Display Gadget entry section.
    this.showNew = true;
  }

  // This method associate to Delete Button.
  onDelete(id: number) {
    // Delete the corresponding Gadget entry from the list.
    // this.gadgets.splice(index, 1);
    this.http.delete(`${this.api}/delete/${id}`).subscribe(response => {
      this.refreshList();
    });
  }

  // This method associate toCancel Button.
  onCancel() {
    // Hide Gadget entry section.
    this.showNew = false;
  }

  onSearch(){
    this.http.get<Gadget[]>(`${this.api}/search/${this.keyword}`).subscribe(gadgets => this.gadgets = gadgets);
  }
  
}
