import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTransactions,
  createTransaction,
  returnTransaction,
} from "../features/transactions/transactionSlice.js"; // ✅ Adjust path if needed
import { fetchBooks } from "../features/books/bookSlice.js"; // ✅ Adjust path if needed
import { fetchMembers } from "../features/members/memberSlice.js"; // ✅ Adjust path if needed

export default function BorrowReturn() {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transaction.transactions); // ✅ Update based on your slice name
  const books = useSelector((state) => state.book.books); // ✅ Update based on your slice name
  const members = useSelector((state) => state.member.members); // ✅ Update based on your slice name
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [borrowDate, setBorrowDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  // const [actionType, setActionType] = useState("borrow");

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchBooks());
    dispatch(fetchMembers());
  }, [dispatch]);

  const handleSubmit = () => {
    if (selectedBook && selectedMember && borrowDate) {
      const transaction = {
        bookId: parseInt(selectedBook),
        memberId: parseInt(selectedMember),
        borrowDate: borrowDate,
        dueDate: returnDate,
      };

      dispatch(createTransaction(transaction)); // replace with your Redux dispatch function
      // Reset form
      setSelectedBook("");
      setSelectedMember("");
      setBorrowDate("");
      setReturnDate("");
    }
  };

  const calculateReturnDate = (date) => {
    const d = new Date(date);
    d.setDate(d.getDate() + 14); // 2 weeks
    return d.toISOString().split("T")[0];
  };

  const returnBook = (transactionId) => {
    dispatch(returnTransaction(transactionId));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Book Borrowing & Returning</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
        {/* Borrow/Return Form */}
        <div className="card lg:col-span-2">
          <div className="p-5">
            <h2 className="text-xl font-semibold mb-4">Borrow Book</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Borrow Date *
                </label>
                <input
                  type="date"
                  className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                  value={borrowDate}
                  onChange={(e) => {
                    setBorrowDate(e.target.value);
                    setReturnDate(calculateReturnDate(e.target.value));
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Return Date
                </label>
                <input
                  type="date"
                  className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Book *
                </label>
                <select
                  className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                >
                  <option value="">Select a book</option>
                  {books
                    .filter((book) => book.availableCopies > 0)
                    .map((book) => (
                      <option key={book.bookId} value={book.bookId}>
                        {book.title} by {book.author}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Member *
                </label>
                <select
                  className="input-field border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                >
                  <option value="">Select a member</option>
                  {members
                    .filter((member) => member.status === "ACTIVE" || member.membershipStatus === "ACTIVE")
                    .map((member) => (
                      <option key={member.memberId} value={member.memberId}>
                        {member.name} ({member.email})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <button className="btn btn-primary w-full" onClick={handleSubmit}>
              Borrow Book
            </button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="p-5">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <div className="space-y-4">
              {transactions.slice(0, 2).map((transaction) => {
                return (
                  <div
                    key={transaction.transactionId}
                    className="border-b border-gray-200 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {transaction.book?.title}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${transaction.status === "BORROWED"
                            ? "bg-yellow-100 text-yellow-800"
                            : transaction.status === "OVERDUE"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Member: {transaction.member?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Borrowed: {transaction.borrowDate}
                    </p>
                    {transaction.status === "Borrowed" && (
                      <p className="text-sm text-gray-600">
                        Due: {transaction.dueDate}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* All Transactions */}
      <div className="card">
        <div className="p-5">
          <h2 className="text-xl font-semibold mb-4">All Transactions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Book</th>
                  <th className="py-3 px-4 text-left">Member</th>
                  <th className="py-3 px-4 text-left">Borrow Date</th>
                  <th className="py-3 px-4 text-left">Due Date</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => {
                  return (
                    <tr
                      key={transaction.transactionId}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">{transaction.book.title}</td>
                      <td className="py-3 px-4">{transaction.member?.name}</td>
                      <td className="py-3 px-4">{transaction.borrowDate}</td>
                      <td className="py-3 px-4">{transaction.dueDate}</td>
                      <td className="py-3 px-4">
                        <button
                          className={`px-2 py-1 rounded-full text-xs ${transaction.status === "BORROWED"
                              ? "bg-yellow-100 text-yellow-800"
                              : transaction.status === "OVERDUE"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          onClick={() => {
                            if (
                              transaction.status === "BORROWED" ||
                              transaction.status === "OVERDUE"
                            ) {
                              returnBook(transaction.transactionId);
                            }
                          }}
                        >
                          {transaction.status}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
