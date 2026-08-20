import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createExpense } from "../../store/slices/expenseSlice";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function ExpenseModal({ isOpen, onClose, branchId }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    description: "",
    expense_date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!branchId) return;

    await dispatch(
      createExpense({
        ...formData,
        branch_id: branchId,
        amount: parseFloat(formData.amount) || 0,
      }),
    );
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add General Expense">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <Input
          label="Amount"
          type="number"
          step="0.01"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />
        <Input
          label="Expense Date"
          type="date"
          name="expense_date"
          value={formData.expense_date}
          onChange={handleChange}
          required
        />
        <Input
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="surface" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Expense
          </Button>
        </div>
      </form>
    </Modal>
  );
}
