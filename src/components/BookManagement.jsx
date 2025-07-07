import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchBooks,
  createBook,
  removeBook,
  editBook,
} from "../features/books/bookSlice.js";

export default function BookManagement() {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.book.books);
  const [errorMessage, setErrorMessage] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    isbn: "",
    yearPublished: "",
    totalCopies: "",
    availableCopies: "",
  });
  const [editBookId, setEditBookId] = useState(null);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleAddBook = () => {
    const currentYear = new Date().getFullYear();
    const {
      title,
      author,
      genre,
      isbn,
      yearPublished,
      totalCopies,
      availableCopies,
    } = newBook;

    // Basic required field check
    if (!title || !author) {
      setErrorMessage("Title and Author are required.");
      return;
    }

    // Validation checks
    if (isNaN(totalCopies) || totalCopies < 0) {
      setErrorMessage(
        "Total and Available Copies must be non-negative numbers."
      );
      return;
    }

    if (availableCopies > totalCopies) {
      setErrorMessage("Available copies cannot exceed total copies.");
      return;
    }

    if (
      isNaN(Number(yearPublished)) ||
      Number(yearPublished) < 1450 ||
      Number(yearPublished) > currentYear
    ) {
      setErrorMessage(
        `Published year must be between 1450 and ${currentYear}.`
      );
      return;
    }

    const book = {
      ...newBook,
      yearPublished: parseInt(newBook.yearPublished),
      availableCopies: parseInt(newBook.totalCopies),
      totalCopies: parseInt(newBook.totalCopies),
    };
    dispatch(createBook(book));
    setShowAddModal(false);
    setNewBook({
      title: "",
      author: "",
      genre: "",
      isbn: "",
      yearPublished: "",
      totalCopies: "",
      availableCopies: "",
    });
    setErrorMessage("");
  };

  const handleDeleteBook = (id) => {
    dispatch(removeBook(id));
  };

  const handleUpdateBook = () => {
    const { title, author, yearPublished, totalCopies, availableCopies } =
      newBook;
    const currentYear = new Date().getFullYear();

    // Field Validations
    if (!title || !author) {
      setErrorMessage("Title and Author are required.");
      return;
    }

    if (
      isNaN(Number(yearPublished)) ||
      Number(yearPublished) < 1450 ||
      Number(yearPublished) > currentYear
    ) {
      setErrorMessage(
        `Published year must be between 1450 and ${currentYear}.`
      );
      return;
    }

    if (
      isNaN(totalCopies) ||
      isNaN(availableCopies) ||
      totalCopies < 0 ||
      availableCopies < 0
    ) {
      setErrorMessage(
        "Total and Available Copies must be non-negative numbers."
      );
      return;
    }

    if (availableCopies > totalCopies) {
      setErrorMessage("Available copies cannot be more than total copies.");
      return;
    }

    const updatedBook = {
      ...newBook,
      yearPublished: parseInt(newBook.yearPublished),
      totalCopies: parseInt(newBook.availableCopies),
      availableCopies: parseInt(newBook.totalCopies),
    };

    dispatch(editBook({ id: editBookId, updatedBook }));

    // Reset form and close modal
    setShowAddModal(false);
    setEditBookId(null);
    setNewBook({
      title: "",
      author: "",
      genre: "",
      isbn: "",
      yearPublished: "",
      totalCopies: "",
      availableCopies: "",
    });

    setErrorMessage("");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Book Management</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <i className="fas fa-plus mr-2"></i> Add Book
        </button>
      </div>

      {/* Books Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-gray-200 bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">No.</th>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Author</th>
                <th className="py-3 px-4 text-left">Genre</th>
                <th className="py-3 px-4 text-left">ISBN</th>
                <th className="py-3 px-4 text-left">Year</th>
                <th className="py-3 px-4 text-left">Total Copies</th>
                <th className="py-3 px-4 text-left">Available Copies</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{book.title}</td>
                  <td className="py-3 px-4">{book.author}</td>
                  <td className="py-3 px-4">{book.genre}</td>
                  <td className="py-3 px-4">{book.isbn}</td>
                  <td className="py-3 px-4">{book.yearPublished}</td>
                  <td className="py-3 px-4">{book.totalCopies}</td>
                  <td className="py-3 px-4">{book.availableCopies}</td>
                  <td className="py-3 px-4">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-3"
                      onClick={() => {
                        setNewBook({
                          title: book.title,
                          author: book.author,
                          genre: book.genre,
                          isbn: book.isbn,
                          yearPublished: book.yearPublished,
                          totalCopies: book.totalCopies,
                          availableCopies: book.availableCopies,
                        });
                        setEditBookId(book.bookId); // set the ID of the book being edited
                        setShowAddModal(true); // open the modal
                      }}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    {/* <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      <i className="fas fa-trash"></i>
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editBookId ? "Edit Book" : "Add New Book"}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setShowAddModal(false);
                  setEditBookId(null); // Reset edit mode
                  setNewBook({
                    title: "",
                    author: "",
                    genre: "",
                    isbn: "",
                    yearPublished: "",
                    totalCopies: "",
                    availableCopies: "",
                  });
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* FORM FIELDS (Same as before) */}
            <div className="space-y-4">
              {/* Title Field */}
              {/* Error Message */}
              {errorMessage && (
                <div className="text-red-600 text-sm font-medium mt-2">
                  {errorMessage}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                  value={newBook.title}
                  onChange={(e) => {
                    setErrorMessage(""); // Clear error on change
                    setNewBook({ ...newBook, title: e.target.value });
                  }}
                />
              </div>

              {/* Author Field */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Author *
                </label>
                <input
                  type="text"
                  className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                  value={newBook.author}
                  onChange={(e) => {
                    setErrorMessage(""); // Clear error on change
                    setNewBook({ ...newBook, author: e.target.value });
                  }}
                />
              </div>

              {/* Genre and ISBN */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Genre
                  </label>
                  <input
                    type="text"
                    className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                    value={newBook.genre}
                    onChange={(e) =>
                      setNewBook({ ...newBook, genre: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ISBN</label>
                  <input
                    type="text"
                    className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                    value={newBook.isbn}
                    onChange={(e) =>
                      setNewBook({ ...newBook, isbn: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Year and Copies */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Year Published
                  </label>
                  <input
                    type="number"
                    className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                    value={newBook.yearPublished}
                    onChange={(e) => {
                      setErrorMessage(""); // Clear error on change
                      setNewBook({ ...newBook, yearPublished: e.target.value });
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Total Copies
                  </label>
                  <input
                    type="number"
                    className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                    value={newBook.totalCopies}
                    onChange={(e) => {
                      setErrorMessage(""); // Clear error on change
                      setNewBook({ ...newBook, totalCopies: e.target.value });
                    }}
                  />
                </div>

                {/* <div>
                  <label className="block text-sm font-medium mb-1">
                    Available Copies
                  </label>
                  <input
                    type="number"
                    className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                    value={newBook.availableCopies}
                    onChange={(e) => {
                      setErrorMessage(""); // Clear error on change
                      setNewBook({
                        ...newBook,
                        availableCopies: e.target.value,
                      });
                    }}
                  />
                </div> */}
              </div>
              {/* Buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  className="btn bg-gray-200 hover:bg-gray-300"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditBookId(null);
                    setNewBook({
                      title: "",
                      author: "",
                      genre: "",
                      isbn: "",
                      yearPublished: "",
                      copies: "",
                    });
                    setErrorMessage("");
                  }}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={editBookId ? handleUpdateBook : handleAddBook}
                >
                  {editBookId ? "Update Book" : "Add Book"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
