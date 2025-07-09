import { useSelector, useDispatch } from "react-redux";
import {
  fetchFines,
  payFine,
  createFine,
  cancelFine,
  updateFines,
  reverseFine,
} from "../features/fines/fineSlice.js";
import { useEffect, useState, useCallback } from "react";
import OverdueBooksSummary from "./OverdueBooksSummary.jsx";

export default function OverdueFines() {
  const dispatch = useDispatch();
  const { fines } = useSelector((state) => state.fines);

  const [pendingFines, setPendingFines] = useState(0);
  const [collectedFines, setCollectedFines] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddFineModal, setShowAddFineModal] = useState(false);
  const [newFine, setNewFine] = useState({
    transactionId: "",
    fineType: "",
    amount: "",
  });

  // Fetch fines on mount
  useEffect(() => {
    dispatch(fetchFines()).finally(() => setLoading(false));
  }, [dispatch]);

  // Calculate summary when fines change
  useEffect(() => {
    if (!fines || fines.length === 0) return;

    let pending = 0;
    let collected = 0;

    fines.forEach(({ fineDTO }) => {
      if (!fineDTO) return;

      const { status, amount } = fineDTO;
      if (status === "PENDING") pending += Number(amount);
      else if (status === "PAID") collected += Number(amount);
    });

    setPendingFines(Number(pending.toFixed(2)));
    setCollectedFines(Number(collected.toFixed(2)));
  }, [fines]);

  const handleMarkAsPaid = useCallback(
    (fineId) => {
      dispatch(payFine(fineId));
    },
    [dispatch]
  );

  const handleCancelPayment = useCallback(
    (fineId) => {
      dispatch(cancelFine(fineId));
    },
    [dispatch]
  );

  const handleReversePayment = useCallback(
    (fineId) => {
      dispatch(reverseFine(fineId));
    },
    [dispatch]
  );

  const handleUpdateFine = async () => {
    try {
      await dispatch(updateFines()).unwrap();
      console.log("✅ Fines updated successfully");
    } catch (error) {
      console.error("❌ Failed to update fines:", error);
      alert("Something went wrong while updating fines.");
    }
  };

  const handleAddFine = () => {
    const { transactionId, fineType, amount } = newFine;

    if (
      !transactionId ||
      isNaN(transactionId) ||
      parseInt(transactionId) <= 0
    ) {
      alert("Please enter a valid Transaction ID.");
      return;
    }

    if (!fineType) {
      alert("Please select a Fine Type.");
      return;
    }

    if (
      amount === "" ||
      amount === null ||
      isNaN(parseFloat(amount)) ||
      parseFloat(amount) <= 0
    ) {
      alert("Please enter a valid Amount.");
      return;
    }

    dispatch(
      createFine({
        transactionId: parseInt(transactionId),
        fineType,
        amount: parseFloat(amount),
      })
    );

    setShowAddFineModal(false);
    setNewFine({ transactionId: "", fineType: "", amount: "" });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-600">
        <i className="fas fa-spinner fa-spin text-3xl text-blue-500 mb-3"></i>
        <p className="text-sm">Loading fines...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Overdue Books & Fines</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <OverdueBooksSummary displayNumber={3} />

        <div className="card">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Fines Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-medium">Total Outstanding Fines</p>
                  <p className="text-sm text-gray-600">
                    Unpaid fines across all members
                  </p>
                </div>
                <span className="text-2xl font-bold text-red-500">
                  ₹{pendingFines}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Total Collected Fines</p>
                  <p className="text-sm text-gray-600">Paid fines this month</p>
                </div>
                <span className="text-2xl font-bold text-green-500">
                  ₹{collectedFines}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fines List */}
      <div className="card">
        <div className="p-5">
          <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center mb-4">
            <h2 className="text-xl font-semibold mb-2 lg:mb-0">
              Fines Management
            </h2>
            <div className="flex gap-3 ml-auto">
              <button className="btn btn-primary" onClick={handleUpdateFine}>
                <i className="mr-2"></i> Update Fines
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowAddFineModal(true)}
              >
                <i className="fas fa-plus mr-2"></i> Add Fine
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Member</th>
                  <th className="py-3 px-4 text-left">Amount</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Borrow Date</th>
                  <th className="py-3 px-4 text-left">Due Date</th>
                  <th className="py-3 px-4 text-left">Paid Date</th>
                  <th className="py-3 px-4 text-left">Fine Type</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fines.map((fine) => {
                  const { fineDTO, borrowingTransactionResponseDTO } = fine;
                  const { fineId, status, fineType, amount, paidDate } =
                    fineDTO || {};
                  const { member, borrowDate, dueDate } =
                    borrowingTransactionResponseDTO || {};

                  return (
                    <tr
                      key={fineId}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">{member?.name || "-"}</td>
                      <td className="py-3 px-4">
                        ₹{amount?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : status === "PAID"
                              ? "bg-green-100 text-green-800"
                              : status === "CANCELLED"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {borrowDate?.split("T")[0] || "-"}
                      </td>
                      <td className="py-3 px-4">
                        {dueDate?.split("T")[0] || "-"}
                      </td>
                      <td className="py-3 px-4">
                        {paidDate?.split("T")[0] || "-"}
                      </td>
                      <td className="py-3 px-4">{fineType || "-"}</td>
                      <td className="py-3 px-4">
                        {status === "PENDING" && (
                          <>
                            <button
                              className="btn btn-secondary px-3 py-1 text-sm"
                              onClick={() => handleMarkAsPaid(fineId)}
                            >
                              Mark as Paid
                            </button>
                            <button
                              className="btn btn-secondary px-3 py-1 text-sm ml-2"
                              onClick={() => handleCancelPayment(fineId)}
                            >
                              Cancel Fine
                            </button>
                          </>
                        )}
                        {status === "PAID" && (
                          <button
                            className="btn btn-secondary px-3 py-1 text-sm"
                            onClick={() => handleReversePayment(fineId)}
                          >
                            Reverse Payment
                          </button>
                        )}
                        {status === "CANCELLED" && (
                          <span className="text-red-600 font-semibold px-2 py-1 text-sm rounded">
                            CANCELLED
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Fine Modal */}
      {showAddFineModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Fine</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowAddFineModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Transaction ID *
                </label>
                <input
                  type="number"
                  className="input-field w-full"
                  value={newFine.transactionId}
                  onChange={(e) =>
                    setNewFine({ ...newFine, transactionId: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Fine Type *
                </label>
                <select
                  className="input-field w-full"
                  value={newFine.fineType}
                  onChange={(e) =>
                    setNewFine({ ...newFine, fineType: e.target.value })
                  }
                >
                  <option value="">Select Fine Type</option>
                  <option value="LOST_ITEM">Lost Item</option>
                  <option value="DAMAGED_ITEM">Damaged Item</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Amount *
                </label>
                <input
                  type="number"
                  className="input-field w-full"
                  value={newFine.amount}
                  onChange={(e) =>
                    setNewFine({ ...newFine, amount: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  className="btn bg-gray-200 hover:bg-gray-300"
                  onClick={() => setShowAddFineModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleAddFine}>
                  Add Fine
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
