import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {OrderClient} from '../model/order.model';
import {OrderService} from '../service/order.service';
import {MatIcon} from '@angular/material/icon';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css'],
  imports: [
    MatIcon,
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  standalone: true
})
export class NewOrderComponent implements OnInit {
  clientForm!: FormGroup; // Definite assignment assertion
  allClients: OrderClient[] = []; // Holds all clients fetched from the server
  filteredClients: OrderClient[] = []; // Holds the filtered clients based on search
  isLoading = false;
  noResults = false;
  isNewClientOpen = false;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    protected router: Router
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
    this.orderService.setSelectedClient(client);
    this.router.navigate(['/complete-order']).then();
  }

  /**
   * Creates a new client and navigates to the Complete Order page upon success.
   */
  createClient(): void {
    if (this.clientForm.valid) {
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
          this.orderService.setSelectedClient(createdClient);
          this.router.navigate(['/complete-order']).then();
        },
        (error) => {
          console.error('Error creating client:', error);
          // Handle error (e.g., show notification)
        }
      );
    }
  }
}
