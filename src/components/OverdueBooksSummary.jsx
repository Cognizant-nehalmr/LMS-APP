import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { fetchTransactions } from "../features/transactions/transactionSlice";

const OverdueBooksSummary = ({ displayNumber }) => {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transaction.transactions);
  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const overdueTransactions = transactions
    .filter((t) => t.status === "OVERDUE" && new Date(t.dueDate) < new Date())
    .slice(0, displayNumber); // Adjust how many you want to display

  return (
    <div className="card">
      <div className="p-5">
        <h2 className="text-xl font-semibold mb-4">Overdue Books</h2>
        <div className="space-y-4">
          {overdueTransactions.length === 0 && (
            <p className="text-gray-500">No overdue books.</p>
          )}

          {overdueTransactions.map((transaction) => {
            const book = transaction.book;
            const member = transaction.member;
            const daysOverdue = Math.floor(
              (new Date() - new Date(transaction.dueDate)) /
                (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={transaction.transactionId}
                className="flex items-center justify-between border-b pb-3 border-gray-200"
              >
                <div>
                  <p className="font-medium">{book?.title}</p>
                  <p className="text-sm text-gray-600">
                    Borrowed by: {member?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-red-500 font-medium">
                    {daysOverdue} days overdue
                  </p>
                  <p className="text-sm text-gray-600">
                    Due: {transaction.dueDate}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OverdueBooksSummary;
