import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createWithdrawal } from "../../store/slices/withdrawalSlice";
import { fetchTeamMembers } from "../../store/slices/teamMemberSlice";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

export default function WithdrawalModal({ isOpen, onClose, branchId, businessId }) {
  const dispatch = useDispatch();
  const { teamMembers } = useSelector((state) => state.teamMember);
  
  const [formData, setFormData] = useState({
    amount: "",
    withdrawn_by: "",
    payment_method: "Cash",
    withdrawal_date: "",
    description: ""
  });

  useEffect(() => {
    if (businessId) {
      dispatch(fetchTeamMembers(businessId));
    }
  }, [businessId, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!branchId) return;
    
    await dispatch(
      createWithdrawal({
        ...formData,
        branch_id: branchId,
        amount: parseFloat(formData.amount) || 0
      })
    );
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Withdrawal">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Amount" type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} required />
        
        <Select 
          label="Withdrawn By" 
          name="withdrawn_by" 
          value={formData.withdrawn_by} 
          onChange={handleChange} 
          required
          options={[
            { label: "Select Team Member", value: "" },
            ...(teamMembers?.map((member) => ({
              label: `${member.first_name} ${member.last_name || ""}`,
              value: member.id
            })) || [])
          ]}
        />

        <Input label="Date" type="date" name="withdrawal_date" value={formData.withdrawal_date} onChange={handleChange} required />
        <Select 
          label="Method" 
          name="payment_method" 
          value={formData.payment_method} 
          onChange={handleChange}
          options={[
            { label: "Cash", value: "Cash" },
            { label: "Bank Transfer", value: "Bank Transfer" },
            { label: "Cheque", value: "Cheque" }
          ]}
        />
        <Input label="Description" name="description" value={formData.description} onChange={handleChange} />
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="surface" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">Save Withdrawal</Button>
        </div>
      </form>
    </Modal>
  );
}
