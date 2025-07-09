import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBooks } from "../features/books/bookSlice.js";
import { fetchMembers } from "../features/members/memberSlice.js";
import { fetchTransactions } from "../features/transactions/transactionSlice.js";
import OverdueBooksSummary from "./OverdueBooksSummary.jsx";

export default function Dashboard() {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.book.books);
  const members = useSelector((state) => state.member.members);
  const transactions = useSelector((state) => state.transaction.transactions);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dispatch(fetchBooks()),
      dispatch(fetchMembers()),
      dispatch(fetchTransactions()),
    ]).finally(() => setLoading(false));
  }, [dispatch]);

  const activeMembers = members.filter((m) => m.membershipStatus === "ACTIVE");
  const borrowedBooks = transactions.filter((t) => t.status === "BORROWED");
  const overdueBooks = transactions.filter((t) => t.status === "OVERDUE");

  const stats = [
    {
      title: "Total Books",
      value: books.length,
      icon: "fas fa-book",
      color: "bg-primary",
    },
    {
      title: "Active Members",
      value: activeMembers.length,
      icon: "fas fa-users",
      color: "bg-secondary",
    },
    {
      title: "Borrowed Books",
      value: borrowedBooks.length,
      icon: "fas fa-exchange-alt",
      color: "bg-accent",
    },
    {
      title: "Overdue Books",
      value: overdueBooks.length,
      icon: "fas fa-clock",
      color: "bg-red-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-600">
        <i className="fas fa-spinner fa-spin text-4xl mb-3 text-blue-600"></i>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="p-5 flex items-center">
              <div className={`${stat.color} text-white p-3 rounded-lg mr-4`}>
                <i className={`${stat.icon} text-xl`}></i>
              </div>
              <div>
                <p className="text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="card">
          <div className="p-5">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 text-left">Book</th>
                    <th className="py-2 text-left">Member</th>
                    <th className="py-2 text-left">Due Date</th>
                    <th className="py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 5).map((transaction) => {
                    const book = books.find((b) => b.id === transaction.bookId);
                    const member = members.find(
                      (m) => m.id === transaction.memberId
                    );

                    return (
                      <tr
                        key={transaction.id}
                        className="border-b hover:bg-gray-50 border-gray-200"
                      >
                        <td className="py-3">{book?.title || "-"}</td>
                        <td className="py-3">{member?.name || "-"}</td>
                        <td className="py-3">
                          {transaction.dueDate?.split("T")[0] || "-"}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              transaction.status === "BORROWED"
                                ? "bg-yellow-100 text-yellow-800"
                                : transaction.status === "OVERDUE"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Overdue Books Summary */}
        <OverdueBooksSummary displayNumber={3} />
      </div>
    </div>
  );
}
