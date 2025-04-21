
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BookService } from './book.service';
import { Book } from './book';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  books: Book[] = [];
  errorMessage: string = '';
  newBook: Book = { id: 0, name: '', author: '', description: '' };
  bookId: number = 0;
  selectedBook: Book | null=null;

  constructor(private bookService: BookService) { }

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        console.log('Books received:', books); // Debug log
        this.books = books;
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Failed to load books: ' + error.message;
      }
    });
  }

  getBookById() {
    this.bookService.getBook(this.bookId).subscribe({
      next:(book)=>{
        this.selectedBook=book;
        console.log('Book received:', book); // Debug log
        this.errorMessage='';
      }
      ,error:(error)=>{
        this.errorMessage='Failed to get book: '+error.message;
        this.selectedBook=null;
      }
    });

  }

  deleteBookById(id:number) {
    this.bookService.deleteBook(id).subscribe({
      next:()=>{
        this.books=this.books.filter(book=>book.id!=id);
        console.log('Book deleted:', this.bookId); // Debug log
        this.errorMessage='';
      }
      ,error:(error)=>{
        this.errorMessage='Failed to delete book: '+error.message;
        this.selectedBook=null;
      }
    });

  }



  addBook() {
    const bookToSend = {
      name: this.newBook.name,
      author: this.newBook.author,
      description: this.newBook.description
    };
    console.log('Sending book:', bookToSend);
    this.bookService.addBook(bookToSend).subscribe({
      next:(book)=>{
        this.books.push(book);
        this.newBook={ id: 0, name: '', author: '', description: '' };
        console.log('Book added:', this.newBook); // Debug log
        this.errorMessage='';
      }
      ,error:(error)=>{
        this.errorMessage='Failed to add book: '+error.message;
      }
    });
  }
}