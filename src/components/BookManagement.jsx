import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchBooks,
  createBook,
  editBook,
} from "../features/books/bookSlice.js";

export default function BookManagement() {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.book.books);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editBookId, setEditBookId] = useState(null);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    isbn: "",
    yearPublished: "",
    totalCopies: "",
    availableCopies: "",
  });

  useEffect(() => {
    dispatch(fetchBooks()).finally(() => setLoading(false));
  }, [dispatch]);

  const resetForm = () => {
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
    setEditBookId(null);
  };

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

    if (!title || !author) {
      setErrorMessage("Title and Author are required.");
      return;
    }

    if (
      isNaN(totalCopies) ||
      isNaN(availableCopies) ||
      totalCopies < 0 ||
      availableCopies < 0
    ) {
      setErrorMessage("Total and Available Copies must be non-negative.");
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
      yearPublished: parseInt(yearPublished),
      totalCopies: parseInt(totalCopies),
      availableCopies: parseInt(availableCopies),
    };

    dispatch(createBook(book));
    setShowAddModal(false);
    resetForm();
  };

  const handleUpdateBook = () => {
    const { title, author, yearPublished, totalCopies, availableCopies } =
      newBook;
    const currentYear = new Date().getFullYear();

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
      setErrorMessage("Total and Available Copies must be non-negative.");
      return;
    }

    if (availableCopies > totalCopies) {
      setErrorMessage("Available copies cannot exceed total copies.");
      return;
    }

    const updatedBook = {
      ...newBook,
      yearPublished: parseInt(yearPublished),
      totalCopies: parseInt(totalCopies),
      availableCopies: parseInt(availableCopies),
    };

    dispatch(editBook({ id: editBookId, updatedBook }));
    setShowAddModal(false);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-600">
        <i className="fas fa-spinner fa-spin text-4xl mb-3 text-blue-600"></i>
        <p>Loading books...</p>
      </div>
    );
  }

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
                  key={book.bookId}
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
                        setNewBook(book);
                        setEditBookId(book.bookId);
                        setShowAddModal(true);
                      }}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
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
                  resetForm();
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="text-red-600 text-sm font-medium mb-3">
                {errorMessage}
              </div>
            )}

            {/* FORM */}
            <div className="space-y-4">
              {[
                { label: "Title *", key: "title", type: "text" },
                { label: "Author *", key: "author", type: "text" },
                { label: "Genre", key: "genre", type: "text" },
                { label: "ISBN", key: "isbn", type: "text" },
                {
                  label: "Year Published",
                  key: "yearPublished",
                  type: "number",
                },
                { label: "Total Copies", key: "totalCopies", type: "number" },
                {
                  label: "Available Copies",
                  key: "availableCopies",
                  type: "number",
                },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none w-full"
                    value={newBook[field.key]}
                    onChange={(e) => {
                      setErrorMessage("");
                      setNewBook({ ...newBook, [field.key]: e.target.value });
                    }}
                  />
                </div>
              ))}

              {/* Actions */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  className="btn bg-gray-200 hover:bg-gray-300"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
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