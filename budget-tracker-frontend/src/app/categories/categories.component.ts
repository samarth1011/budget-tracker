import { Component } from '@angular/core';

import { CategoriesService } from '../services/categories.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Category } from '../models/Category';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { Modal } from 'bootstrap';
@Component({
  selector: 'app-categories',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
categories: Category[] = [];
//make like edit transaction
  editCategory: Category = {
    user: 0,
    id: 0,
    name: '',
    created_at: '',
  };
  loading = true;
  error: string | null = null;
  message: string | null = null;
  newCategoryName: string = '';
  updatedCategoryName: string = '';

  constructor(private categoriesService: CategoriesService,private authService: AuthService ) {}

  ngOnInit() {
    this.categoriesService.getCategories().subscribe({
      next: (data) => {
        // Assuming the API returns an array of categories
        // and that the Category interface is defined in the dashboard service
        console.log('Categories:', data);
        this.categories = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load categories.';
        this.loading = false;
      }
    });
  }

  deleteCategory(id: number) {
    this.loading = true;
    this.categoriesService.deleteCategory(id).subscribe({
      next: (data) => {
        this.categories = this.categories.filter(category => category.id !== id);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to delete category.'+err.message;
        this.loading = false;
      }
    });
  }

  addCategory(name: string) {
    if (!name) {
      this.error = 'Category name cannot be empty.';
      return;
    }

    this.loading = true;
    const newCategory: Partial<Category> = { name };
    this.categoriesService.addCategory(newCategory).subscribe({
      next: (data) => {
        this.categories.push(data);
        this.loading = false;
        this.message = 'Category '+ name+' added successfully.';
       
      },
      error: (err) => {
        this.error = 'Failed to add category.'+err.message;
        this.loading = false;
      }
    });

     const modalElement = document.getElementById('addCategoryModal');
      if (modalElement) {
        const bsModal = Modal.getInstance(modalElement) || new Modal(modalElement);
        bsModal.hide();
      }
            // Fallback manual removal
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');

      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
      this.newCategoryName = ''; 
  }

  //get category by id
  getCategoryById(id: number) {
    this.loading = true;
    this.categoriesService.getCategory(id).subscribe({
      next: (data) => {
        this.editCategory = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load category.'+err.message;
        this.loading = false;
      }
    });

  }

  updateCategory(id: number, name: string) {
    
    this.loading = true;
    const updatedCategory: Partial<Category> = { name };
    this.categoriesService.updateCategory(id, updatedCategory).subscribe({
      next: (data) => {
        const index = this.categories.findIndex(category => category.id === id);
        if (index !== -1) {
          this.categories[index] = data;
        }
        this.loading = false;
        this.message = 'Category updated successfully.';
      },
      error: (err) => {
        this.error = 'Failed to update category.'+err.message;
        this.loading = false;
      }
    });
    
    const modalElement = document.getElementById('editCategoryModal');
      if (modalElement) {
        const bsModal = Modal.getInstance(modalElement) || new Modal(modalElement);
        bsModal.hide();
      }
            // Fallback manual removal
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');

      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
  }
}
