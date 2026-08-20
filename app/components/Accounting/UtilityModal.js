import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUtilityBill } from "../../store/slices/utilityBillSlice";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

export default function UtilityModal({ isOpen, onClose, branchId }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    vendor: "",
    utility_type: "Electricity",
    amount: "",
    payment_method: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!branchId) return;

    await dispatch(
      createUtilityBill({
        ...formData,
        branch_id: branchId,
        amount: parseFloat(formData.amount) || 0,
      }),
    );
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Utility Bill">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Vendor"
          name="vendor"
          value={formData.vendor}
          onChange={handleChange}
          required
        />
        <Select
          label="Utility Type"
          name="utility_type"
          value={formData.utility_type}
          onChange={handleChange}
          options={[
            { label: "Electricity", value: "Electricity" },
            { label: "Water", value: "Water" },
            { label: "Gas", value: "Gas" },
            { label: "Internet", value: "Internet" },
            { label: "Rent", value: "Rent" },
            { label: "Other", value: "Other" },
          ]}
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
          label="Payment Method"
          name="payment_method"
          value={formData.payment_method}
          onChange={handleChange}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="surface" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
