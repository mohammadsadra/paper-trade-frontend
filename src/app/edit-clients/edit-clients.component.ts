import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OrderClient} from '../model/order.model';
import {OrderService} from '../service/order.service';
import {Router} from '@angular/router';
import {debounceTime} from 'rxjs/operators';
import {NgForOf, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-edit-clients',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    ReactiveFormsModule,
    MatIcon
  ],
  templateUrl: './edit-clients.component.html',
  styleUrl: './edit-clients.component.css'
})
export class EditClientsComponent implements OnInit {
  clientForm!: FormGroup;
  allClients: OrderClient[] = [];
  filteredClients: OrderClient[] = [];
  isLoading = false;
  noResults = false;
  isNewClientOpen = false;
  editingClient: OrderClient | null = null;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      searchClient: [''],
      newClientName: [''],
      newClientFamily: [''],
    });

    this.fetchAllClients();
    this.clientForm.get('searchClient')!.valueChanges.pipe(debounceTime(300)).subscribe((searchTerm) => {
      this.filterClients(searchTerm);
    });
  }

  toggleClientForm(): void {
    this.isNewClientOpen = !this.isNewClientOpen;
  }

  fetchAllClients(): void {
    this.isLoading = true;
    this.orderService.getAllClients().subscribe(
      (clients) => {
        this.allClients = clients.$values;
        this.filteredClients = this.allClients;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching clients:', error);
        this.isLoading = false;
      }
    );
  }

  filterClients(searchTerm: string): void {
    const term = searchTerm.toLowerCase();
    this.filteredClients = this.allClients.filter(
      (client) =>
        client.name.toLowerCase().includes(term) ||
        client.family.toLowerCase().includes(term)
    );
  }

  editClient(client: OrderClient): void {
    this.editingClient = { ...client }; // Clones the client to avoid direct mutation.
  }


  saveClient(client: OrderClient): void {
    if (this.editingClient && this.editingClient.name && this.editingClient.family) {
      client.name = this.editingClient.name;
      client.family = this.editingClient.family;
      this.orderService.updateClient(client).subscribe(
        () => {
          this.editingClient = null; // Clear editing state after save
        },
        (error) => {
          console.error('Error updating client:', error);
        }
      );
    }
  }


  removeClient(client: OrderClient): void {
    this.orderService.deleteClient(client.id).subscribe(
      () => {
        this.allClients = this.allClients.filter((c) => c.id !== client.id);
        this.filterClients(this.clientForm.get('searchClient')!.value || '');
      },
      (error) => {
        console.error('Error removing client:', error);
      }
    );
  }

  createClient(): void {
    if (this.clientForm.valid) {
      const newClient: Partial<OrderClient> = {
        name: this.clientForm.value.newClientName,
        family: this.clientForm.value.newClientFamily,
      };

      this.orderService.createClient(newClient).subscribe(
        (createdClient) => {
          this.allClients.push(createdClient);
          this.filterClients('');
          this.isNewClientOpen = false;
        },
        (error) => {
          console.error('Error creating client:', error);
        }
      );
    }
  }
}
