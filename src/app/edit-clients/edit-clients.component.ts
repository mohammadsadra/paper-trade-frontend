import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {OrderClient} from '../model/order.model';
import {OrderService} from '../service/order.service';
import {MatIcon} from '@angular/material/icon';
import {NgForOf, NgIf} from '@angular/common';
import Swal from 'sweetalert2'
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-clients',
  templateUrl: './edit-clients.component.html',
  styleUrls: ['./edit-clients.component.css'],
  imports: [
    MatIcon,
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  standalone: true
})
export class EditClientsComponent implements OnInit {
  clientForm!: FormGroup; // Definite assignment assertion
  allClients: OrderClient[] = []; // Holds all clients fetched from the server
  filteredClients: OrderClient[] = []; // Holds the filtered clients based on search
  isLoading = false;
  noResults = false;
  isFormOpen = false;
  isNewPerson = false;
  selectedClient: OrderClient | null = null;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    protected router: Router,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Initialize the form
    this.clientForm = this.fb.group({
      searchClient: [''],
      newClientName: [''],
      newClientFamily: [''],
      // Add other client fields as needed
    });

    // Fetch all clients on component initialization
    this.fetchAllClients();

    // Subscribe to search input changes to filter clients locally
    this.clientForm.get('searchClient')!.valueChanges
      .pipe(debounceTime(300)) // Add debounce to limit rapid filtering
      .subscribe((searchTerm) => {
        this.filterClients(searchTerm);
      });
  }

  /**
   * Fetches all clients from the server and initializes the client lists.
   */
  fetchAllClients(): void {
    this.isLoading = true;
    this.orderService.getAllClients().subscribe(
      (c) => {
        const clients = c.$values;
        this.allClients = clients;
        this.filteredClients = clients; // Initially, all clients are displayed
        this.isLoading = false;
        if (clients.length === 0){
          console.log('hi')
          this.noResults = true
        }
      },
      (error) => {
        console.error('Error fetching clients:', error);
        this.isLoading = false;
        // Optionally, handle the error (e.g., show a notification)
      }
    );
  }

  /**
   * Filters the clients based on the search term.
   * @param searchTerm The term to search for.
   */
  filterClients(searchTerm: string): void {

    // Perform case-insensitive search on client name and family
    const term = searchTerm.toLowerCase();
    this.filteredClients = this.allClients.filter(
      (client) =>
        client.name.toLowerCase().includes(term) ||
        client.family.toLowerCase().includes(term)
    );
  }

  /**
   * Navigates to the Complete Order page with the selected client's ID.
   * @param client The selected client.
   */
  selectClient(client: OrderClient): void {
    this.selectedClient = client;
    this.isNewPerson = false;
    this.isFormOpen = true;
    this.clientForm.get('newClientName')?.setValue(client.name);
    this.clientForm.get('newClientFamily')?.setValue(client.family);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openCreateClient(){
    this.clientForm.get('newClientName')?.setValue('');
    this.clientForm.get('newClientFamily')?.setValue('');
    this.selectedClient = null;
    this.isNewPerson = true;
    this.isFormOpen = true;
  }

  /**
   * Creates a new client or Edit a client
   */
  createOrEditClient(): void {
    if (this.clientForm.valid) {
      if (this.isNewPerson){
        const newClient: Partial<OrderClient> = {
          name: this.clientForm.value.newClientName,
          family: this.clientForm.value.newClientFamily,
          // Populate other fields as needed
          createDateTime: new Date().toISOString(),
        };

        this.orderService.createClient(newClient).subscribe(
          (createdClient) => {
            // Optionally, add the new client to the local lists
            this.allClients.push(createdClient);
            this.filteredClients = this.allClients;
            this.isFormOpen = false;
            this.isNewPerson = false;
            this.snackbar.open('The client has been successfully created.',
              '    ',{duration: 3000, verticalPosition: 'bottom', // 'top' | 'bottom'
                horizontalPosition: 'center', //'start' | 'center' | 'end' | 'left' | 'right'
                panelClass: 'success-snackbar'});
          },
          (error) => {
            console.error('Error creating client:', error);
            // Handle error (e.g., show notification)
          }
        );
      } else {
        const newClient: Partial<OrderClient> = {
          id: this.selectedClient?.id,
          name: this.clientForm.value.newClientName,
          family: this.clientForm.value.newClientFamily,
          createDateTime: this.selectedClient?.createDateTime
        };

        this.orderService.updateClient(newClient).subscribe(
          (_) => {

            // Update the client in allClients list
            const allClientsIndex = this.allClients.findIndex(client => client.id === newClient.id);
            if (allClientsIndex !== -1) {
              this.allClients[allClientsIndex].name = this.clientForm.value.newClientName;
              this.allClients[allClientsIndex].family = this.clientForm.value.newClientFamily;
            }

            // Update the client in filteredClients list
            const filteredClientsIndex = this.filteredClients.findIndex(client => client.id === newClient.id);
            if (filteredClientsIndex !== -1) {
              this.allClients[allClientsIndex].name = this.clientForm.value.newClientName;
              this.allClients[allClientsIndex].family = this.clientForm.value.newClientFamily;
            }

            this.snackbar.open('Changes were saved successfully.',
              '    ',{duration: 3000, verticalPosition: 'bottom', // 'top' | 'bottom'
                horizontalPosition: 'center', //'start' | 'center' | 'end' | 'left' | 'right'
                panelClass: 'success-snackbar'});

            this.isFormOpen = false;

          },
          (error) => {
            console.error('Error editing client:', error);
            // Handle error (e.g., show notification)
          }
        );

      }
    }
  }

  /**
   * Deletes a client
   */
  deleteClient(){
    Swal.fire({
      title: 'Delete ' + this.selectedClient?.name + ' ' + this.selectedClient?.family,
      text: 'If you delete this client, all orders associated with this client will also be deleted.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#FF0000',
      cancelButtonText: 'Close'
    }).then((res)=>{
      if (res.isConfirmed) {
        this.orderService.deleteClient(this.selectedClient?.id).subscribe(
          () => {
            // Remove client from allClients
            this.allClients = this.allClients.filter(client => client.id !== this.selectedClient?.id);

            // Remove client from filteredClients
            this.filteredClients = this.filteredClients.filter(client => client.id !== this.selectedClient?.id);
            this.selectedClient = null;
            this.isFormOpen = false;
            this.snackbar.open('The client has been successfully deleted.',
              '    ',{duration: 4000, verticalPosition: 'bottom', // 'top' | 'bottom'
                horizontalPosition: 'center', //'start' | 'center' | 'end' | 'left' | 'right'
                panelClass: 'success-snackbar'});
          },
          (error) => {
            console.error('Error deleting client:', error);
          }
        );
      }
    })
  }
}
