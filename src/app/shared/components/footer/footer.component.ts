import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-white shadow-sm mt-auto py-3">
      <div class="container">
        <div class="text-center text-muted">
          <p class="mb-0">&copy; 2024 Document Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class FooterComponent { } 